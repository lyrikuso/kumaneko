if (process.client) {

    // bootstrap
    require("./bootstrap/bootstrap.min.js")

    // bootgrid
    require("./jquery.bootgrid/jquery.bootgrid.min.js")
    require("./jquery.bootgrid/jquery.bootgrid.fa.min.js")

    // flexdatalist
    require("./jquery-flexdatalist/jquery.flexdatalist.min")

    // jssocials
    require("./jssocials/jssocials.min.js")

    jsSocials.shares.twitter = {
        label: "Tweet",
        logo: "icon-twitter",
        shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
        countUrl: ""
    }
    jsSocials.shares.facebook = {
        label: "Like",
        logo: "icon-facebook",
        shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
        countUrl: "https://graph.facebook.com/?id={url}",
        getCount: function(data) {
            return data.share && data.share.share_count || 0;
        }
    }
    jsSocials.shares.line = {
        label: "LINE",
        logo: "icon-line",
        shareUrl: "http://line.me/R/msg/text/?{text} {url}",
        countUrl: ""
    }
    jsSocials.shares.hatena = {
        label: "Hatena",
        logo: "icon-hatenabookmark",
        shareUrl: "http://b.hatena.ne.jp/entry/{url}",
        countUrl: ""
    }
}