<template>
    <div>

        <div class="container" v-for='(array, index) in this.locations' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Rooms</div>
            <div v-else-if='index === 1' class="label">Desks</div>

            <div v-if='array.length > 0' class="row" style='text-align: center;'>
                <div class="col">Name</div>
                <div class="col">Point Cost</div>
                <div class="col">Color</div>
                <div class="col">Actions</div>
            </div>

            <div class="row" style='text-align: center;'
            v-for='(location, index) in array' :key="'loc:'+location.id" :style="$parent.styleRow(index)">
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{location.name}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{location.cost}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{location.color}}</div>
                </div>
                <div class="col">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-4">
                                <button class="btn btn-primary btn-lg editBtn" v-on:click="openLocationModal(location)"></button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-dark btn-lg deleteBtn" v-on:click="removeLocation(location)"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space" v-if='array.length > 0'></div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <button class="col-6 btn btn-success btn-lg btn-block createBtn" v-on:click="openLocationModal()"></button>
            </div>
        </div>


        <!-- Modals -->
        <LocationModal ref="LocationModal"></LocationModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>


<style lang="scss">
</style>


<script>
    import * as api from '@/services/api_access';

    //Modals
    import LocationModal from './LocationModal.vue';

    //Dimmer
    import Dimmer from '../modals/components/Dimmer';

    export default {
        components: {
            //Modals
            LocationModal,

            //Dimmer
            Dimmer
        },

        data() {
            return {
                locations: this.$parent.locations
            }
        },

        methods: {
            updateLocations() {
                this.$parent.getLocations();
            },

            removeLocation(location) {
                var responce = confirm("Are you sure you want to delete location - " + location.name);
                if (responce) {
                    api.admin_RemoveLocation(location.id).then(
                        removeResponce => {
                            if (removeResponce == '100')
                                this.$parent.getLocations();
                            else if (removeResponce == '404') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openLocationModal(location=null) {
                this.closeModals();
                if (location === null) {
                    this.$refs.LocationModal.openModal('create', location);
                }
                else if (location !== null) {
                    this.$refs.LocationModal.openModal('update', location);
                }
                this.$refs.Dimmer.openDimmer();
            },
            closeModals() {
                this.$refs.LocationModal.closeModal()
            },
            closeDimmer() {
                this.$refs.Dimmer.closeDimmer();
            }
        }
    }
</script>