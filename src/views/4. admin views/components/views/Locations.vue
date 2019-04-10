<template>
    <div class="Locations">

        <div class="locsContainer" v-for='(array, index) in this.locations' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Rooms</div>
            <div v-else-if='index === 1' class="label">Desks</div>

            <div class="locsTopRow">
                <div class="locsCol">Name</div>
                <div class="locsCol">Point Cost</div>
                <div class="locsColBtn">Actions</div>
            </div>

            <div class="locsRow" v-for='location in array' :key="'loc:'+location.id">
                <div class="locsCol">
                    <div class="colText">{{location.name}}</div>
                </div>
                <div class="locsCol">
                    <div class="colText">{{location.pointCost}}</div>
                </div>
                <div class="locsColBtn">
                    <button class="btn btn-primary locsBtn editBtn" v-on:click="openViewLocationModal(location)"></button>
                    <button class="btn btn-dark locsBtn deleteBtn" v-on:click="removeLocation(location)"></button>
                </div>
            </div>
        </div>

        <button class="btn btn-success usersBtn createBtn" v-on:click="openCreateLocationModal()"></button>

        <!-- Modals -->
        <ViewLocationModal ref="ViewLocationModal"></ViewLocationModal>
        <CreateLocationModal ref="CreateLocationModal"></CreateLocationModal>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Locations.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import ViewLocationModal from '../modals/locations/ViewLocationModal.vue';
    import CreateLocationModal from '../modals/locations/CreateLocationModal.vue';

    export default {
        components: {
            ViewLocationModal,
            CreateLocationModal
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
                            if (removeResponce == '100') {
                                this.$parent.getLocations();
                            }
                            else if (removeResponce == '409') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openViewLocationModal(location) {
                this.closeModals();
                this.$refs.ViewLocationModal.openModal(location);
            },
            openCreateLocationModal() {
                this.closeModals();
                this.$refs.CreateLocationModal.openModal();
            },
            closeModals() {
                this.$refs.ViewLocationModal.closeModal()
                this.$refs.CreateLocationModal.closeModal();
            }
        }
    }
</script>