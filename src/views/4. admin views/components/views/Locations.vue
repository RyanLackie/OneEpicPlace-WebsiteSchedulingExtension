<template>
    <div class="Data">

        <div class="dataContainer" v-for='(array, index) in this.locations' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Rooms</div>
            <div v-else-if='index === 1' class="label">Desks</div>

            <div v-if='array.length > 0' class="nameRow">
                <div class="dataCol-3">Name</div>
                <div class="dataCol-3">Point Cost</div>
                <div class="dataCol-3">Color</div>
                <div class="dataBtnCol">Actions</div>
            </div>

            <div class="dataRow" v-for='(location, index) in array' :key="'loc:'+location.id" :style="$parent.styleRow(index)">
                <div class="dataCol-3">
                    <div class="text">{{location.name}}</div>
                </div>
                <div class="dataCol-3">
                    <div class="text">{{location.cost}}</div>
                </div>
                <div class="dataCol-3">
                    <div class="text">{{location.color}}</div>
                </div>
                <div class="dataBtnCol">
                    <button class="btn btn-primary actionBtn editBtn" v-on:click="openViewLocationModal(location)"></button>
                    <button class="btn btn-dark actionBtn deleteBtn" v-on:click="removeLocation(location)"></button>
                </div>
            </div>

            <div class="space" v-if='array.length > 0'></div>
        </div>

        <button class="btn btn-success actionBtn createBtn" v-on:click="openCreateLocationModal()"></button>

        <!-- Modals -->
        <ViewLocationModal ref="ViewLocationModal"></ViewLocationModal>
        <CreateLocationModal ref="CreateLocationModal"></CreateLocationModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>

<style scoped lang="scss">

</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import ViewLocationModal from '../modals/locations/ViewLocationModal.vue';
    import CreateLocationModal from '../modals/locations/CreateLocationModal.vue';

    //Dimmer
    import Dimmer from '../modals/components/Dimmer';

    export default {
        components: {
            //Modals
            ViewLocationModal,
            CreateLocationModal,

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

            openViewLocationModal(location) {
                this.closeModals();
                this.$refs.ViewLocationModal.openModal(location);
                this.$refs.Dimmer.openDimmer();
            },
            openCreateLocationModal() {
                this.closeModals();
                this.$refs.CreateLocationModal.openModal();
                this.$refs.Dimmer.openDimmer();
            },
            closeModals() {
                this.$refs.ViewLocationModal.closeModal()
                this.$refs.CreateLocationModal.closeModal();
            },
            closeDimmer() {
                this.$refs.Dimmer.closeDimmer();
            }
        }
    }
</script>