const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas } = require("canvas");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let canvas;
let ctx;

function splitByMeasureWidth (str, maxWidth, context) {
    // サロゲートペアを考慮した文字分割
    let chars = Array.from(str);
    let line = "";
    let lines = [];
    for (let index = 0; index < chars.length; index++) {
        if (maxWidth <= context.measureText(line + chars[index]).width) {
            lines.push(line);
            line = chars[index];
        } else {
            line += chars[index];
        }
    }
    lines.push(line);
    return lines;
}

/**
 * @api {post} /webhooks/upload
 * @apiGroup WEBHOOK
 * @apiName Cloudinary Upload
 * @apiParam {String} title Message to display.
 * @apiSuccess {Object} error Response from Cloudinary API.
 * @apiSuccess {Object} result Response from Cloudinary API.
 */
router.post("/upload", (req, res) => {

    let canvasWidth = 1200;
    let canvasHeight = 630;
    const padding = 80;
    const titleMargin = 40;
    const titleFontStyle = {
        font: "73px 'しっぽり明朝'",
        lineHeight: 80,
        color: "#333333"
    };
    const title = req.body.title;
    const backgroundColor = "#fafafa"

    canvas = createCanvas(canvasWidth, canvasHeight)
    ctx = canvas.getContext("2d")

    // 行長さ
    const lineWidth = canvasWidth - (padding * 2);
    // フォント設定
    ctx.font = titleFontStyle.font;
    // 行数の割り出し
    const titleLines = splitByMeasureWidth(title, lineWidth, ctx);
    const titleLineCnt = titleLines.length;
    // タイトル分の高さ
    const titleHeight = titleLines.length * titleFontStyle.lineHeight;
    // 行高さと余白が最小高さ(630)を上回る場合はカンバスをリサイズする
    let contentHeight = titleHeight + titleMargin + (padding * 2);
    if (canvasHeight < contentHeight) {
        canvasHeight = contentHeight
        canvas = createCanvas(canvasWidth, contentHeight)
        ctx = canvas.getContext("2d")
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 文字描画のベースラインを設定
    ctx.textBaseline = "top";
    // タイトルを描画
    ctx.fillStyle = titleFontStyle.color;
    ctx.font = titleFontStyle.font;
    for (let index = 0; index < titleLineCnt; index++) {
        const element = titleLines[index];
        ctx.fillText(element, padding, padding + (titleFontStyle.lineHeight * index))
    }

    const b64 = canvas.toDataURL();
    cloudinary.uploader.upload(b64, { tags: title }, (error, result) => {
        res.status(200).send({
            error: error,
            result: result
        });
    });

});


module.exports = router
