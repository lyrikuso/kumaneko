const webpack = require("webpack")
const isdev = (process.env.NODE_ENV === "development")

module.exports = {

    mode: "universal",

    /*
    ** Headers of the page
    */
    head: {
        htmlAttrs: {
            lang: "ja",
            prefix: "og:http://ogp.me/ns#"
        },
        title: "短歌ジェネレーター",
        titleTemplate: `くまねこ - %s`,
        meta: [
            { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" },
            { name: "google-site-verification", content: "235YhdO-YxyJEfMSllBfO_8PM3DL3tu-e3teVUZkksU" },
            { name: "theme-color", content: "#ffffff" },
            { hid: "description", name: "description", content: "短歌ジェネレーターです。与えられたフレーズから短歌のようなものを生成します。" },
            { hid: "og:type", property: "og:type", content: "website" },
            { hid: "og:title", property: "og:title", content: "くまねこ" },
            { hid: "og:url", property: "og:url", content: "https://kumaneko.herokuapp.com/" },
            { hid: "og:image", property: "og:image", content: "https://kumaneko.herokuapp.com/contents/panda.jpg" },
            { hid: "og:site_name", property: "og:site_name", content: "くまねこ" },
            { hid: "og:description", property: "og:description", content: "短歌ジェネレーターです。与えられたフレーズから短歌のようなものを生成します。" },
            { hid: "twitter:card", name: "twitter:card", content: "summary" },
            { hid: "twitter:site", name: "twitter:site", content: "@shinabitanori" },
            { hid: "twitter:widgets:autoload", name: "twitter:widgets:autoload", content: "on" },
            { hid: "twitter:widgets:csp", name: "twitter:widgets:csp", content: "on" },
            { hid: "twitter:dnt", name: "twitter:dnt", content: "on" },
        ],
        link: [
            { rel: "icon", href: "/favicon.ico" },
            { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
            { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
            { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
            { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
            { rel: "shortcut icon", href: "/favicon/favicon.ico" },
            { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/fork-awesome/1.1.7/css/fork-awesome.min.css", integrity: "sha256-gsmEoJAws/Kd3CjuOQzLie5Q3yshhvmo7YNtBG7aaEY=", crossorigin: "anonymous" },
            { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/jsSocials/1.5.0/jssocials.min.css", integrity: "sha256-1tuEbDCHX3d1WHIyyRhG9D9zsoaQpu1tpd5lPqdqC8s=", crossorigin: "anonymous" },
            { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/pretty-checkbox/3.0.0/pretty-checkbox.min.css", integrity: "sha256-KCHcsGm2E36dSODOtMCcBadNAbEUW5m+1xLId7xgLmw=", crossorigin: "anonymous" }
        ],
        script: [
            { src: "https://platform.twitter.com/widgets.js", async: true, defer: true }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: "#fff" },
    /*
    ** Global CSS
    */
    css: [
        "@/assets/css/bootstrap.min.css",
        "@/assets/css/jquery.flexdatalist.min.css",
        "@/assets/css/jquery.bootgrid.min.css",
        "@/assets/css/icomoon.css"
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        { src: "@/plugins/clientOnly.client.js", ssr: false }
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        "@nuxtjs/axios",
        "@nuxtjs/proxy",
        "@nuxtjs/google-gtag",
        ["@nuxtjs/pwa", {
            manifest: { publicPath:  "/_nuxt/" }
        }],
        ["@nuxtjs/google-analytics", {
            id: "UA-73417314-9"
        }],
        ["@nuxtjs/component-cache", {
            maxAge: isdev ? 0 : 10 * 60 * 1000,
            updateAgeOnGet: true
        }],
        "nuxt-compress",
        "@nuxtjs/sitemap"
    ],
    "google-gtag": {
      id: "UA-73417314-9",
      config: {
        // check out official docs: https://developers.google.com/analytics/devguides/collection/gtagjs/
        anonymize_ip: true,
        send_page_view: false
      },
      debug: false
    },
    axios: {
        proxy: true,
        retry: true
    },
    proxy: {
        "/api": isdev ? "http://localhost:3000/" : "https://kumaneko.herokuapp.com/",
        "/webhooks": "https://kumaneko.herokuapp.com/"
    },
    sitemap: {
        hostname: "https://kunameko.herokuapp.com",
        gzip: true,
    },
    /*
    ** Build configuration
    */
    build: {
        plugins: [
            new webpack.ProvidePlugin({
                "$": "jquery",
                "jQuery": "jquery",
                "window.jQuery": "jquery",
                "_": "underscore"
            })
        ],
        extractCSS: true
    }
}