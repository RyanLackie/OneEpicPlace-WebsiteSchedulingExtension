<template>
    <div class="Data">

        <div class="dataContainer">

            <div class="nameRow">
                <div class="dataCol-3">Name</div>
                <div class="dataCol-3">Point Cost</div>
                <div class="dataCol-3">Quantity</div>
                <div class="dataBtnCol">Actions</div>
            </div>

            <div class="dataRow" v-for='(resource, index) in this.resources' :key="'res:'+resource.id" :style="$parent.styleRow(index)">
                <div class="dataCol-3">
                    <div class="text">{{resource.name}}</div>
                </div>
                <div class="dataCol-3">
                    <div class="text">{{resource.cost}}</div>
                </div>
                <div class="dataCol-3">
                    <div class="text">{{resource.quantity}}</div>
                </div>
                <div class="dataBtnCol">
                    <button class="btn btn-primary actionBtn editBtn" v-on:click="openViewResourceModal(resource)"></button>
                    <button class="btn btn-dark actionBtn deleteBtn" v-on:click="removeResource(resource)"></button>
                </div>
            </div>
        </div>

        <div class="space"></div>

        <button class="btn btn-success actionBtn createBtn" v-on:click="openCreateResourceModal()"></button>

        <!-- Modals -->
        <ViewResourceModal ref="ViewResourceModal"></ViewResourceModal>
        <CreateResourceModal ref="CreateResourceModal"></CreateResourceModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>

<style scoped lang="scss">

</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import ViewResourceModal from '../modals/resources/ViewResourceModal.vue';
    import CreateResourceModal from '../modals/resources/CreateResourceModal.vue';

    //Dimmer
    import Dimmer from '../modals/components/Dimmer';

    export default {
        components: {
            //Modals
            ViewResourceModal,
            CreateResourceModal,

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

            openViewResourceModal(resource) {
                this.closeModals();
                this.$refs.ViewResourceModal.openModal(resource);
                this.$refs.Dimmer.openDimmer();
            },
            openCreateResourceModal() {
                this.closeModals();
                this.$refs.CreateResourceModal.openModal();
                this.$refs.Dimmer.openDimmer();
            },
            closeModals() {
                this.$refs.ViewResourceModal.closeModal();
                this.$refs.CreateResourceModal.closeModal();
            },
            closeDimmer() {
                this.$refs.Dimmer.closeDimmer();
            }
        }
    }
</script>