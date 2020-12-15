<template>
    <header>
        <div class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                    <nuxt-link to="/" class="navbar-brand">くまねこ</nuxt-link>
                    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                <div class="navbar-collapse collapse" id="navbar-main">
                    <ul class="nav navbar-nav">
                        <li><nuxt-link to="/">Home</nuxt-link></li>
                        <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tools <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><nuxt-link to="/kiyose">Kiyose</nuxt-link></li>
                            <li><nuxt-link to="/gson">GsonSearch</nuxt-link></li>
                            <li><nuxt-link to="/baboon">Baboon</nuxt-link></li>
                            <li><nuxt-link to="/otoshibumi">Otoshibumi</nuxt-link></li>
                        </ul>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {

}
</script>