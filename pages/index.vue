<template>
<div>
    <my-header></my-header>
    <section>
        <div class="container">
            <div class="page-header">
                <div class="row">
                    <div class="col-lg-8 col-md-7 col-sm-12 col-md-offset-1">
                        <p>入力されたフレーズを詠み込んで短歌のようなものを生成します。</p>
                        <p>好きな言葉を入力すると、その言葉が含まれる名詞・修飾部・述部をサジェストします。<wbr /> 「名詞」「修飾部」「述部」と入力すると一覧をサジェストします。また「3」「7」などと入力するとその音数の語彙をサジェストします。</p>
                        <p>デフォルトで登録されている語彙は<a href="http://sasakiarara.com/sizzle/" target="_blank" rel="noopener">短歌自動生成装置「犬猿」（星野しずる）</a>に収録されている語彙を借りたものです。<wbr /></p>
                    </div>
                </div>
            </div>
            <div class="page-header">
                <div class="row">
                    <div class="col-lg-8 col-md-7 col-sm-12 col-md-offset-1">
                        <form class="form-horizontal">
                            <fieldset>
                                <div class="form-group">
                                    <label for="textArea" class="col-lg-2 control-label">フレーズ</label>
                                    <div class="col-lg-10">
                                        <input id="fdatalist" class="form-control" rows="3" minlength="1" maxlength="30" required>
                                        <span class="help-block">30字まで入力できます</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-lg-6 col-lg-offset-2 btn-group">
                                        <a role="button" class="btn btn-default" data-loading-text="このフレーズを使う" @click.prevent="generate" id="generate">このフレーズを使う</a>
                                        <a role="button" class="btn btn-info" data-loadig-text="再生成" @click.prevent="regenerate" id="regenerate">再生成</a>
                                    </div>
                                </div>
                            </fieldset>
                        </form>

                        <hr />

                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <div class="panel panel-info">
                                <div class="panel-heading" role="tab" id="heading">
                                    <h4 class="panel-title">
                                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#list" aria-expanded="true" aria-controls="chunkListing" class="btn btn-link"></a>
                                    </h4>
                                </div>
                                <div id="list" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading">
                                    <div class="panel-body">
                                        <div>
                                            <p>{{ metas.title }}</p>
                                            <p class="pull-right">
                                                <a role="button" :href="tweetlink" class="btn btn-link twitter-share-button" target="_new">Tweet</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><!-- .accordion -->
					</div>
                </div>
            </div>
            <div class="page-header">
                <div class="row">
                    <div class="col-lg-8 col-md-7 col-sm-12 col-md-offset-1">
                        <jssocials :context="metas.description"></jssocials>
                    </div>
                </div>
            </div>
		</div>
    </section>
    <my-footer :message="metas.mes"></my-footer>
</div>
</template>

<script>
import Vue from "vue"
import Vuelidate from "vuelidate"

Vue.use(Vuelidate)

import { required, maxLength } from "vuelidate/lib/validators"

import header from "~/components/Header.vue"
import footer from "~/components/Footer.vue"
import jssocials from "~/components/Jssocials.vue"

export default {
    data () {
        return {
            keyphrase: [],
            text: ""
        }
    },
    asyncData ({ app, params }) {
        return app.$axios.get("/api/vocab")
        .then(res => {
            return {
                phrases: res.data.vocab
            }
         })
        .catch(error => {
            console.error(error.response)
            return {
                phrases: []
            }
        })
    },
    head () {
        const structuredData = {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "https://kumaneko.herokuapp.com/",
            "name": "くまねこ"
        }
        return {
            title: "短歌ジェネレーター",
            __dangerouslyDisableSanitizers: ["script"],
            script: [
                {
                    innerHTML: JSON.stringify(structuredData),
                    type: "application/ld+json"
                }
            ]
        }
    },
    components: {
        "my-header": header,
        "my-footer": footer,
        "jssocials": jssocials
    },
    methods: {
        createPoem (keyphrase, btn) {
            $.ajax("/api/poem",
            {
                type: "post",
                data: keyphrase,
                dataType: "json",
                timeout: 10000,
                dataFilter: (data, type) => {
                    return data
                },
                success: (data, dataType) => {
                    if (_.isError(data)) {
                        console.error(data)
                    } else {
                        const poems = [_.object(["text", "url", "hashtags"], [data.info, "https://kumaneko.herokuapp.com/", "kumaneko"])]
                        const template = _.template(`<div class="hiddenfirst" style="display:none"><p><%= text %></p><p class="pull-right"><a role="button" href="https://twitter.com/intent/tweet?text=<%= text %>&url=<%= url %>&hashtags=<%= hashtags %>" class="btn btn-link twitter-share-button" target="_new">Tweet</a></p><br /><hr /></div>`)
                        $.each(poems,
                            (index, elem) => {
                                const tmp = template(elem)
                                $(".panel-body").prepend(tmp)
                                $(".hiddenfirst").fadeIn("fast")
                            }
                        )
                    }
                },
                complete: () => {
                    btn.button("reset")
                }
            })
        },
        generate () {
            const self = this
            const $btn = $("#generate").button("loading")

            const sep = $("#fdatalist").val()
            this.text = sep.replace(/;/g, "")
            this.$v.text.$touch()

            if (!this.$v.text.$invalid) {
                $.when(
                    $.ajax("/api/analyse",
                    {
                        type: "post",
                        data: { sentence: self.$v.text.$model },
                        dataType: "json",
                        timeout: 15000,
                        dataFilter: (data, type) => {
                            return data
                        },
                        success: (data, dataType) => {
                            if (_.isError(data)) {
                                console.error(data)
                            } else {
                                // キーフレーズを格納する
                                const surfaces = _.map(data.info,
                                    obj => {
                                        return obj.surface
                                    }
                                )
                                const phraselast = _.last(surfaces)
                                const phrase = _.reduce(surfaces, (memo, str) => { return memo.concat(str) })
                                // 音数のカウント
                                const rlengths = _.map(data.info,
                                    obj => {
                                        return obj.rlength
                                    }
                                )
                                const mora = _.reduce(rlengths, (memo, num) => { return memo + num }, 0)

                                self.keyphrase = { phraselast: phraselast, phrase: phrase, mora: mora }
                            }
                        },
                        error: (xhr, status, err) => {
                            console.error(status)
                            $btn.button("reset")
                        }
                    })
                ).done(function () {
                    self.$gtag("event", "click", {
                        event_category: "generate",
                        event_label: "kumaneko"
                    })
                    self.createPoem(self.keyphrase, $btn)
                })
            } else {
                // console.log(this.$v.text.$invalid)
                $btn.button("reset")
            }
        },
        regenerate () {
            if (!_.isEmpty(this.keyphrase)) {
                this.$gtag("event", "click", {
                    event_category: "regenerate",
                    event_label: "kumaneko"
                })
                const $btn = $("#generate").button("loading")
                this.createPoem(this.keyphrase, $btn)
            }
        }
    },
    computed: {
        metas () {
            return {
                title: "くまねこ - 短歌ジェネレーター",
                mes: "くまねこはインターネットから独自に収集した短歌をもとにして作品を生成しているため、もとになった短歌の一部がそのままのかたちで出現することがあります。生成される作品の自作発言等はご遠慮ください。",
                url: "https://kumaneko.herokuapp.com/",
                img: "https://kumaneko.herokuapp.com/contents/panda.jpg",
                description: "くまねこ - 短歌ジェネレーター",
                hashtags: "kumaneko"
            }
        },
        tweetlink () {
            return `https://twitter.com/intent/tweet?text=${this.metas.description}&url=${this.metas.url}&hashtags=${this.metas.hashtags}`
        }
    },
    validations: {
        text: {
            required,
            maxLength: maxLength(30)
        }
    },
    mounted () {
        if (process.browser) {
            $("#fdatalist").flexdatalist({
                data: this.phrases,
                multiple: true,
                searchContains: true,
                searchByWord: true,
                groupBy: "mora",
                searchIn: ["word", "type", "mora"],
                visibleProperties: ["word", "type", "mora"],
                textProperty: "word",
                valueProperty: "word",
                allowDuplicateValues: true,
                minLength: 1,
                valuesSeparator: ";"
            })
        }
    }
}
</script>