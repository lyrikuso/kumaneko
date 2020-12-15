<template>
    <div>
        <client-only>
            <div v-sharethis="text" class="px-2"></div>
        </client-only>
    </div>
</template>

<script>
// require jquery, jsSocial
export default {
    props: [
        "context"
    ],
    directives: {
        sharethis: {
            bind (el,binding,vnode) {
                $(el).jsSocials({
                    shareIn: "popup",
                    showCount: false,
                    showLabel: false,
                    text: document.title,
                    shares: ["facebook", { share: "twitter", hashtags: "kumaneko" }, "line", "hatena"]
                });
            },
            update (el,binding,vnode) {
                const doc = document.createElement("div");
                doc.innerHTML = binding.value;
                const text = binding.value !== "" ? $(doc).text() + "／" + document.title : document.title;
                $(el).jsSocials("option", "text", text);
            }
        }
    },
    computed: {
        text () {
            return this.context ? this.context : "";
        }
    }
}
</script>