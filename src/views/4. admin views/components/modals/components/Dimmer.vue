<template>
    <div class="Dimmer" id="Dimmer" @click="closeModals()"></div>
</template>

<style scoped lang="scss">

</style>

<script>
    export default {        
        methods: {
            closeModals() {
                this.$parent.closeModals();
                this.closeDimmer();
            },

            openDimmer() {
                document.getElementById("Dimmer").style.opacity = "0.5";
                document.getElementById("Dimmer").style.visibility = "visible";
            },
            closeDimmer() {
                document.getElementById("Dimmer").style.opacity = "0.0";
                document.getElementById("Dimmer").style.visibility = "hidden";
            }
        }
    }
</script>