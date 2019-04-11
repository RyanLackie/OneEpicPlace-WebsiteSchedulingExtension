<template>
    <div class="Resources">

        <div class="resContainer">

            <div class="resTopRow">
                <div class="resCol">Name</div>
                <div class="resCol">Quantity</div>
                <div class="resColBtn">Actions</div>
            </div>

            <div class="resRow" v-for='resource in this.resources' :key="'res:'+resource.id">
                <div class="resCol">
                    <div class="colText">{{resource.name}}</div>
                </div>
                <div class="resCol">
                    <div class="colText">{{resource.quantity}}</div>
                </div>
                <div class="resColBtn">
                    <button class="btn btn-primary resBtn editBtn" v-on:click="openViewResourceModal(resource)"></button>
                    <button class="btn btn-dark resBtn deleteBtn" v-on:click="removeResource(resource)"></button>
                </div>
            </div>
        </div>

        <button class="btn btn-success usersBtn createBtn" v-on:click="openCreateResourceModal()"></button>

        <!-- Modals -->
        <ViewResourceModal ref="ViewResourceModal"></ViewResourceModal>
        <CreateResourceModal ref="CreateResourceModal"></CreateResourceModal>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Resources.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import ViewResourceModal from '../modals/resources/ViewResourceModal.vue';
    import CreateResourceModal from '../modals/resources/CreateResourceModal.vue';

    export default {
        components: {
            ViewResourceModal,
            CreateResourceModal
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
                            if (removeResponce == '100') {
                                this.$parent.getResources();
                            }
                            else if (removeResponce == '409') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openViewResourceModal(resource) {
                this.closeModals();
                this.$refs.ViewResourceModal.openModal(resource);
            },
            openCreateResourceModal() {
                this.closeModals();
                this.$refs.CreateResourceModal.openModal();
            },
            closeModals() {
                this.$refs.ViewResourceModal.closeModal()
                this.$refs.CreateResourceModal.closeModal();
            }
        }
    }
</script>