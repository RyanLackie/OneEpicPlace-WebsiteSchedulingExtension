<template>
    <div class="PopUpModal ViewResourceModal" id="ViewResourceModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Edit Resource</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewResourceModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" id="ViewResourceModal-Name" placeholder="Resources's Name" required>

            <label class="label-sm">Point Cost</label>
            <input type="number" class="input-box form-control" id="ViewResourceModal-Cost" required>

            <label class="label-sm">Quantity</label>
            <input type="number" min='0' class="input-box form-control" id="ViewResourceModal-Quantity" required>

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./ResourceModals.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                resource: null
            }
        },

        methods: {
            openModal(resource) {
                //Data
                this.resource = resource;
                
                //Fields
                document.getElementById("ViewResourceModal-Name").value = resource.name;
                document.getElementById("ViewResourceModal-Cost").value = resource.cost;
                document.getElementById("ViewResourceModal-Quantity").value = resource.quantity;

                //Scroll
                document.getElementById('ViewResourceModal').scrollTo(0, 0);

                document.getElementById("ViewResourceModal").style.opacity = "1.0";
                document.getElementById("ViewResourceModal").style.visibility = "visible";
            },
            closeModal() {
                //resource
                this.resource = null;

                document.getElementById("ViewResourceModal").style.opacity = "0.0";
                document.getElementById("ViewResourceModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },

            updateResource(event) {
                var id = this.resource.id;
                var previousName = this.resource.name;
                var name = document.getElementById("ViewResourceModal-Name").value;
                var cost = document.getElementById("ViewResourceModal-Cost").value;
                var quantity = document.getElementById("ViewResourceModal-Quantity").value;
                
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
                
                //Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('ViewResourceModal-Form').addEventListener('submit', this.updateResource);
        }
    }
</script>