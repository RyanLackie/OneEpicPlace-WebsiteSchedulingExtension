<template>
    <div>

        <div class="container">

            <div class="row" style='text-align: center;'>
                <div class="col">Name</div>
                <div class="col">Point Cost</div>
                <div class="col">Quantity</div>
                <div class="col">Actions</div>
            </div>

            <div class="row" style='text-align: center;'
            v-for='(resource, index) in this.resources' :key="'res:'+resource.id" :style="$parent.styleRow(index)">
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{resource.name}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{resource.cost}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{resource.quantity}}</div>
                </div>
                <div class="col">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-4">
                                <button class="btn btn-primary btn-lg editBtn" v-on:click="openResourceModal(resource)"></button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-dark btn-lg deleteBtn" v-on:click="removeResource(resource)"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="space"></div>

        <div class="container">
            <div class="row justify-content-center">
                <button class="col-6 btn btn-success btn-lg btn-block createBtn" v-on:click="openResourceModal()"></button>
            </div>
        </div>

        <!-- Modals -->
        <ResourceModal ref="ResourceModal"></ResourceModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>


<style lang="scss">
</style>


<script>
    import * as api from '@/services/api_access';

    //Modals
    import ResourceModal from './ResourceModal.vue';

    //Dimmer
    import Dimmer from './Dimmer.vue';

    export default {
        components: {
            //Modals
            ResourceModal,

            //Dimmer
            Dimmer
        },

        data() {
            return {
                resources: this.$parent.resources
            }
        },

        methods: {
            updateResources() {
                this.$parent.getResources();
            },

            removeResource(resource) {
                var responce = confirm("Are you sure you want to delete resource - " + resource.name);
                if (responce) {
                    api.admin_RemoveResource(resource.id).then(
                        removeResponce => {
                            if (removeResponce == '100')
                                this.$parent.getResources();
                            else if (removeResponce == '404') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openResourceModal(resource=null) {
                this.closeModals();
                if (resource === null) {
                    this.$refs.ResourceModal.openModal('create', resource);
                }
                else if (resource !== null) {
                    this.$refs.ResourceModal.openModal('update', resource);
                }
                this.$refs.Dimmer.openDimmer();
            },
            closeModals() {
                this.$refs.ResourceModal.closeModal();
            },
            closeDimmer() {
                this.$refs.Dimmer.closeDimmer();
            }
        }
    }
</script>