const express = require("express");
const axiosBase = require("axios");
const bodyParser = require("body-parser");
const _ = require("lodash");
const sqlite3 = require("sqlite3");
const kuromoji = require("kuromoji");
const s = require("underscore.string");
const async = require("async");
const path = require("path");

const tankadb = path.resolve(__dirname, "datastore/tanka.db");
const kigodb = path.resolve(__dirname, "datastore/kigo.db");
const vocabdb = path.resolve(__dirname, "datastore/vocab.db");

const axios = axiosBase.create({
    baseURL: (process.env.NODE_ENV === "production") ? "https://kumaneko.herokuapp.com" : "http://localhost:3000",
    headers: {
        "ContentType": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    timeout: 4000,
    responseType: "json"
});
const builder = kuromoji.builder({
    dicPath: "./node_modules/kuromoji/dict"
});

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * @api {post} /api/analyse
 * @apiGroup API/POEM
 * @apiName AnalysePhrase
 * @apiParam {String} sentence Phrase to be analysed.
 * @apiError (500) error Unable to build tokenizer.
 * @apiSuccess {Object[]} info Array of token information.
 */
router.post("/analyse", (req, res) => {

    const target = req.body.sentence;

    builder.build((err, tokenizer) => {
        if (err) {
            res.status(500).send({
                error: err
            });
        } else {
            /**
             * GetLetterCountOfString
             * @param {String} str String body.
             * @return {Number} Letter length.
             */
            function readings(str) {
                const target = s.map(str, x => {
                    let res = x;
                    if (res === "ァ") {
                        res = ""
                    };
                    if (res === "ィ") {
                        res = ""
                    };
                    if (res === "ゥ") {
                        res = ""
                    };
                    if (res === "ェ") {
                        res = ""
                    };
                    if (res === "ォ") {
                        res = ""
                    };
                    if (res === "ャ") {
                        res = ""
                    };
                    if (res === "ュ") {
                        res = ""
                    };
                    if (res === "ョ") {
                        res = ""
                    };
                    return res;
                });
                return target.length;
            }

            // ここに文字列を渡す
            const tokens = tokenizer.tokenize(target);

            let array = [];
            let rlength;
            tokens.forEach(word => {
                if (word.word_type === "UNKNOWN") { // 未知語は表層形の長さを数える
                    rlength = readings(word.surface_form);
                } else { // 既知の語は発音から音数を数える
                    rlength = readings(word.pronunciation);
                }
                const temp = {
                    "type": word.word_type,
                    "surface": word.surface_form,
                    "pronunciation": word.pronunciation,
                    "rlength": rlength,
                    "pos": word.pos
                };
                array.push(temp);
            });
            // console.log(array);
            res.status(200).json({
                info: array
            });
        }
    });
});

/**
 * @api {post} /api/poem
 * @apiGroup API/POEM
 * @apiName PoemCreation
 * @apiParam {String} keyphrase.phraselast Last term of keyphrase.
 * @apiParam {string} keyphrase.phrase Phrase body.
 * @apiParam {Number} keyphrase.mora Mora count of keyphrase
 * @apiSuccess {String} info Poem body.
 */
router.post("/poem", (req, res) => {

    /**
     * PoemGenerator
     * @param {String} prefix - Prefix phrase.
     * @param {Number} expectation - Length of phrase coming out.
     * @return {String} Poem body.
     */
    function generatePhrases(prefix, expectation) {
        if (expectation <= 0) {
            return {
                data: ""
            };
        }
        if (!_.isEmpty(prefix)) {
            return axios.put("/api/find", {
                pref: prefix,
                expec: expectation
            }).then(response => {
                // console.log(response.data);
                return response.data.body;
            });
        } else {
            return axios.put("/api/random", {
                expec: expectation
            }).then(response => {
                // console.log(response.data);
                return response.data.body;
            });
        }
    };

    /**
     * ConcatPhrases
     * @param {String[]} arr - Array of phrases.
     * @return {String} Phrase body.
     */
    function concatPhrases(arr) {
        const tmp = _.reduce(arr, (memo, str) => {
            return memo.concat(str)
        });
        return tmp;
    }

    (async (keyphrase) => { // console.info(keyphrase);

        try {
            const mora = Number(keyphrase.mora);

            if (mora <= 6) { // 6以下なら3句

                const one = await generatePhrases("", 5);
                const two = await generatePhrases("", 7);
                const four = await generatePhrases(keyphrase.phraselast, 7);
                const five = await generatePhrases("", 7);
                const text = concatPhrases([one, two, keyphrase.phrase, four, five]);
                res.status(200).json({
                    info: text
                });

            } else if (mora >= 7 && mora <= 8) { // 7なら2句

                const one = await generatePhrases("", 5);
                const three = await generatePhrases(keyphrase.phraselast, 5);
                const four = await generatePhrases("", 7);
                const five = await generatePhrases("", 7);
                const text = concatPhrases([one, keyphrase.phrase, three, four, five]);
                res.status(200).json({
                    info: text
                });

            } else if (mora >= 9 && mora <= 13) { // 2句3句

                const one = await generatePhrases("", 5);
                const four = await generatePhrases(keyphrase.phraselast, 7);
                const five = await generatePhrases("", 7);
                const text = concatPhrases([one, keyphrase.phrase, four, five]);
                res.status(200).json({
                    info: text
                });

            } else if (mora >= 14 && mora <= 16) { // 14以上16以下なら下の句

                const one = await generatePhrases("", 5);
                const twothree = await generatePhrases("", 12);
                const text = concatPhrases([one, twothree, keyphrase.phrase]);
                res.status(200).json({
                    info: text
                });

            } else if (mora >= 17 && mora <= 18) { // 上の句

                const four = await generatePhrases(keyphrase.phraselast, 7);
                const five = await generatePhrases("", 7);
                const text = concatPhrases([keyphrase.phrase, four, five]);
                res.status(200).json({
                    info: text
                });

            } else if (mora === 19) { // 19なら先頭5を3句にして下の句

                const onetwo = await generatePhrases("", 12);
                const text = concatPhrases([onetwo, keyphrase.phrase]);
                res.status(200).json({
                    info: text
                });

            } else {

                const onetwo = generatePhrases("", 31 - mora);
                const text = concatPhrases([onetwo, keyphrase.phrase]);
                res.status(200).json({
                    info: text
                });

            }
        } catch (err) {
            console.error(err);
            const text = "うーん、いいのが思いつかないや……ごめんね。";
            res.status(200).json({
                info: text
            });
        }
    })(req.body);
});

/**
 * @api {put} /api/find
 * @apiGroup API/POEM
 * @apiName FindPhrasesComingAfterPrefix
 * @apiParam {String} pref Prefix.
 * @apiParam {Number} expec Expected length.
 * @apiError (500) error Unable to access database.
 * @apiSuccess {String} body Generated phrase.
 */
router.put("/find", (req, res) => {

    const db = new sqlite3.Database(tankadb, sqlite3.OPEN_READONLY);
    db.configure("busyTimeout", 2000);

    let prefix = decodeURIComponent(req.body.pref);
    let expectation = Number(req.body.expec);
    let moracount = 0;

    let strArray = [];

    async.whilst(
        () => {
            return (moracount < expectation);
        },
        (next) => {
            try {
                db.all("SELECT * FROM collection WHERE prefix = $pref AND slength <= $expec ORDER BY Random() LIMIT 1", {
                    $pref: prefix,
                    $expec: (expectation - moracount)
                }, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    if (_.isEmpty(rows)) {
                        db.all("SELECT * FROM chunks WHERE ROWID IN (SELECT ROWID FROM chunks WHERE clength <= $expec ORDER BY Random() LIMIT 1)", {
                            $expec: (expectation - moracount)
                        }, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            // console.log(moracount);
                            // console.log(rows);
                            prefix = rows[0].index;
                            moracount += Number(rows[0].clength);
                            strArray.push(rows[0].chunk);
                            next(null);
                        });
                    } else {
                        // console.log(moracount);
                        // console.log(rows);
                        prefix = rows[0].suffix;
                        moracount += Number(rows[0].plength);
                        strArray.push(rows[0].suffix);
                        next(null);
                    }
                });
            } catch (err) {
                moracount += 31;
                next(err);
            }
        },
        (err) => {
            db.close();
            if (_.isError(err)) {
                res.status(500).send({
                    error: err
                });
            }
            const text = _.reduce(strArray, (memo, str) => {
                return memo.concat(str)
            });
            res.status(200).json({
                body: text
            });
        }
    );
});

/**
 * @api {put} /api/random
 * @apiGroup API/POEM
 * @apiName RandomPharaseGeneration
 * @apiParam {Number} expec Expected length.
 * @apiError (500) error Unable to access database.
 * @apiSuccess {String} body Generated phrase.
 */
router.put("/random", (req, res) => {

    const db = new sqlite3.Database(tankadb, sqlite3.OPEN_READONLY);
    db.configure("busyTimeout", 2000);

    let expectation = Number(req.body.expec);
    let moracount = 0;

    let strArray = [];

    async.whilst(
        () => {
            return (moracount < expectation)
        },
        (next) => {
            try {
                db.all("SELECT * FROM chunks WHERE ROWID IN (SELECT ROWID FROM chunks WHERE clength = $expec ORDER BY Random() LIMIT 1)", {
                    $expec: (expectation - moracount)
                }, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    if (_.isEmpty(rows)) {
                        db.all("SELECT * FROM chunks WHERE ROWID IN (SELECT ROWID FROM chunks WHERE clength <= $expec ORDER BY Random() LIMIT 1)", {
                            $expec: expectation
                        }, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            // console.log(moracount);
                            // console.log(rows);
                            moracount += Number(rows[0].clength);
                            strArray.push(rows[0].chunk);
                            next(null);
                        });
                    } else {
                        // console.log(moracount);
                        // console.log(rows);
                        moracount += Number(rows[0].clength);
                        strArray.push(rows[0].chunk);
                        next(null);
                    }
                });
            } catch (err) {
                moracount += 31;
                next(err);
            }
        },
        (err) => {
            db.close();
            if (_.isError(err)) {
                res.status(500).send({
                    error: err
                });
            }
            const text = _.reduce(strArray, (memo, str) => {
                return memo.concat(str)
            });
            res.status(200).json({
                body: text
            });
        }
    );
});

/**
 * @api {get} /api/vocab
 * @apiGroup API/POEM
 * @apiName GetVocabulary
 * @apiError (500) error Unable to access database.
 * @apiSuccess {Object[]} vocab Vocabulary.
 */
router.get("/vocab", (req, res) => {

    const db = new sqlite3.Database(vocabdb, sqlite3.OPEN_READONLY, (err) => {
        if (err) console.error(err)
    });
    db.configure("busyTimeout", 3000);

    async.parallel([
            (callback) => {
                db.all("SELECT * FROM vocab ORDER BY Random() LIMIT 200", (err, rows) => {
                    callback(err, rows);
                });
            }
        ],
        (err, results) => {
            db.close();
            if (err) {
                res.status(500).send({
                    error: err
                });
            } else {
                res.status(200).json({
                    vocab: results[0]
                });
            }
        })
});

/**
 * @api {get} /api/kigo
 * @apiGroup API/KIYOSE
 * @apiName GetKigoIndex
 * @apiError (500) errror Unable to access database.
 * @apiSuccess {Object[]} seasons Index of seasons.
 * @apiSuccess {Object[]} categories Index of categories.
 */
router.get("/kigo", (req, res) => {

    const db = new sqlite3.Database(kigodb, sqlite3.OPEN_READONLY, (err) => {
        if (err) console.error(err)
    });
    db.configure("busyTimeout", 3000);

    async.parallel([
            (callback) => {
                db.all("SELECT * FROM seasons", (err, rows) => {
                    const obj = _.map(rows, elem => {
                        let obj = elem
                        obj.checked = true
                        return obj
                    });
                    callback(err, obj);
                });
            },
            (callback) => {
                db.all("SELECT * FROM categories", (err, rows) => {
                    let obj = _.map(rows, elem => {
                        let obj = elem
                        obj.checked = true
                        return obj
                    });
                    callback(err, obj);
                });
            }
        ],
        (err, results) => {
            db.close();
            if (err) {
                res.status(500).send({
                    error: err
                });
            } else {
                res.status(200).json({
                    seasons: results[0],
                    categories: results[1]
                });
            }
        })
});

/**
 * @api {post} /api/grid
 * @apiGroup API/KIYOSE
 * @apiName GetKigoAsGrid
 * @apiParam {Number} current
 * @apiParam {Number} rowCount
 * @apiParam {String} searchYomi "true" as string or something else, not boolean.
 * @apiParam {String} searchMode "startsWith", "endsWith" or something else. Default behavior is "include"
 * @apiParam {String} searchPhrase
 * @apiParam {Obeject[]} seasons It will filter only checked seasons.
 * @apiParam {Obeject[]} categories It will filter only checked categories.
 * @apiError (500) error Unable to access database.
 * @apiSuccess {Number} total Total row count of the DB file.
 * @apiSuccess {Object[]} rows Rows body.
 */
router.post("/grid", (req, res) => {

    const db = new sqlite3.Database(kigodb, sqlite3.OPEN_READONLY, (err) => {
        if (err) console.error(err)
    });
    db.configure("busyTimeout", 3000);

    // console.log(req.body);

    async.parallel([
            (callback) => {
                const obj = {
                    current: Number(req.body.current),
                    rowCount: Number(req.body.rowCount),
                    rows: []
                }
                callback(null, obj)
            },
            (callback) => {
                const obj = {
                    seasons: _.chain(req.body.seasons)
                        .filter({
                            checked: "true"
                        })
                        .map(elem => {
                            return elem.id
                        })
                        .map(elem => {
                            return Number(elem)
                        })
                        .value(),
                    categories: _.chain(req.body.categories)
                        .filter({
                            checked: "true"
                        })
                        .map(elem => {
                            return elem.id
                        })
                        .map(elem => {
                            return Number(elem)
                        })
                        .value()
                }
                callback(null, obj)
            },
            (callback) => {
                if (req.body.searchPhrase === "") {
                    db.all("SELECT surfaces.id, kigo, yomi, category, season FROM surfaces LEFT OUTER JOIN dict ON surfaces.did = dict.id", (err, rows) => {
                        callback(err, rows);
                    });
                } else {
                    db.all("SELECT surfaces.id, kigo, yomi, category, season FROM surfaces LEFT OUTER JOIN dict ON surfaces.did = dict.id", (err, rows) => {
                        const target = (req.body.searchYomi === "true") ? "yomi" : "kigo"
                        if (req.body.searchMode === "startsWith") {
                            const list = _.chain(rows)
                                .filter(elem => {
                                    return s.startsWith(elem[target], req.body.searchPhrase)
                                })
                                .value()
                            callback(err, list)
                        } else if (req.body.searchMode === "endsWith") {
                            const list = _.chain(rows)
                                .filter(elem => {
                                    return s.endsWith(elem[target], req.body.searchPhrase)
                                })
                                .value()
                            callback(err, list)
                        } else {
                            const list = _.chain(rows)
                                .filter(elem => {
                                    return s.include(elem[target], req.body.searchPhrase)
                                })
                                .value()
                            callback(err, list)
                        }
                    });
                }
            }
        ],
        (err, results) => {
            db.close();
            if (err) {
                console.error(err);
                res.status(500).send({
                    error: err
                });
            } else {
                let obj = results[0];
                const idx = (obj.current - 1) * obj.rowCount;
                const rows = _.chain(results[2])
                    .filter(elem => {
                        return results[1].seasons.includes(elem.season)
                    })
                    .filter(elem => {
                        return results[1].categories.includes(elem.category)
                    })
                    .value();
                obj.total = rows.length;
                obj.rows = rows.slice(idx, idx + obj.rowCount);

                res.status(200).json(obj);
            }
        });
});


module.exports = router
