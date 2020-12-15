<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header">
                        <p class="text-muted">{{ message }}</p>
                        <p class="text-muted">&copy; 2019 @shinabitanori All rights reserved.｜Photo on <a href="https://visualhunt.com/re5/d02ffaa9" rel="noopener noreferrer">VisualHunt.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    props: [
        "message"
    ]
}
</script>
