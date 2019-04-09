<template>
    <div class="Locations">

        <div class="locsContainer" v-for='(array, index) in this.locations' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Rooms</div>
            <div v-else-if='index === 1' class="label">Desks</div>

            <div class="locsTopRow">
                <div class="locsCol">Name</div>
                <div class="locsCol">Type</div>
                <div class="locsCol">Point Cost</div>
                <div class="locsColBtn">Actions</div>
            </div>

            <div class="locsRow" v-for='location in array' :key="'loc:'+location.id">
                <div class="locsCol">
                    <div class="colText">{{location.name}}</div>
                </div>
                <div class="locsCol">
                    <div class="colText">{{location.type}}</div>
                </div>
                <div class="locsCol">
                    <div class="colText"></div>
                </div>
                <div class="locsColBtn">
                    <button class="btn btn-primary locsBtn editBtn"></button>
                    <button class="btn btn-dark locsBtn deleteBtn"></button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- <ViewLocationModal ref="ViewLocationModal"></ViewLocationModal> -->

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Locations.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    //import ViewLocationModal from '../modals/ViewLocationModal.vue';

    export default {
        components: {
            //ViewLocationModal
        },

        data() {
            return {
                locations: this.$parent.locations
            }
        },

        methods: {
            updateLocations() {
                this.$parent.getLocations();
            }
        }
    }
</script>