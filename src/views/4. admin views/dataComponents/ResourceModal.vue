<template>
    <div class="PopUpModal ResourceModal" id="ResourceModal" aria-hidden="true">
                
        <div class="modal-header">
            <div v-if="modalType === 'create'" class="text">Create Resource</div>
            <div v-if="modalType === 'update'" class="text">Update Resource</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ResourceModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" placeholder="Resources's Name" v-model="name" required>

            <label class="label-sm">Point Cost</label>
            <input type="number" class="input-box form-control" v-model="cost" required>

            <label class="label-sm">Quantity</label>
            <input type="number" min='0' class="input-box form-control" v-model="quantity" required>

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    .ResourceModal {
        height: 90%;
        max-height: 390px;
    }
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                modalType: null,

                id: null,           // For update
                previousName: null, // For update

                name: null,
                cost: null,
                quantity: null,
            }
        },

        methods: {
            openModal(modalType, resource) {
                this.modalType = modalType;

                // For update
                if (this.modalType === 'update') {
                    this.id = resource.id;
                    this.previousName = resource.name;
                    this.name = resource.name;
                    this.cost = resource.cost;
                    this.quantity = resource.quantity;
                }
                // For create
                else {
                    this.name = '';
                    this.cost = 0;
                    this.quantity = 0;
                }

                //Scroll
                document.getElementById('ResourceModal').scrollTo(0, 0);

                document.getElementById("ResourceModal").style.opacity = "1.0";
                document.getElementById("ResourceModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("ResourceModal").style.opacity = "0.0";
                document.getElementById("ResourceModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },

            handelSubmit(event) {
                if (this.modalType === 'create') {
                    this.createResource();
                }
                else if (this.modalType === 'update') {
                    this.updateResource();
                }

                //Prevent submit refresh
                event.preventDefault();
            },
            
            createResource() {
                var name = this.name
                var cost = this.cost;
                var quantity = this.quantity;
                
                api.admin_CreateResource(name, cost, quantity).then(
                    createResult => {
                        if (createResult == '100') {
                            this.close();
                            this.$parent.updateResources();
                        }
                        if (createResult == '408')
                            alert('Name is already taken');
                        else if (createResult == '409') 
                            this.$parent.$refs.Header.logout();
                        }
                );
            },

            updateResource() {
                var id = this.id;
                var previousName = this.previousName;
                var name = this.name
                var cost = this.cost;
                var quantity = this.quantity;
                
                api.admin_UpdateResource(id, previousName, name, cost, quantity).then(
                    updateResult => {
                        if (updateResult == '404') 
                            this.$parent.$refs.Header.logout();
                        else {
                            if (name != updateResult.name)
                                alert('Resource name is already used');
                            else {
                                this.close();
                                this.$parent.updateResources();
                            }
                        }
                    }
                );
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('ResourceModal-Form').addEventListener('submit', this.handelSubmit);
        }
    }
</script>