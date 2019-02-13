<template>
    <div id="app">

        <!-- Page Header -->
        <Header ref="Header"></Header>

        <!-- Page -->
        <router-view/>

    </div>
</template>

<style lang="scss">
    //Bootstrap
    @import "../node_modules/bootstrap/scss/bootstrap.scss";
    //Fonts
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    @import url('https://fonts.googleapis.com/css?family=Playfair+Display');
    @import url('https://fonts.googleapis.com/css?family=Quicksand');
</style>

<script>
    import Header from '@/components/Header.vue'

    export default {
        components: {
            Header
        }
    }
</script>
