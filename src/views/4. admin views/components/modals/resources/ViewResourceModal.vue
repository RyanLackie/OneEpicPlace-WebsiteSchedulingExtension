<template>
    <div class="ViewResourceModal" id="ViewResourceModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Edit Resource</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewResourceModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Name</label>
                <input type="text" class="input-box form-control" id="ViewResourceModal-Name" placeholder="Resources's Name" required>
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Quantity</label>
                <input type="number" min='0' class="input-box form-control" id="ViewResourceModal-Quantity" placeholder="Number of this resource availible" required>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/ViewResourceModal.css";
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
            
            updateResource(event) {
                var id = this.resource.id;
                var previousName = this.resource.name;
                var name = document.getElementById("ViewResourceModal-Name").value;
                var quantity = document.getElementById("ViewResourceModal-Quantity").value;
                
                api.admin_UpdateResource(id, previousName, name, quantity).then(updateResult => {
                    if (updateResult == '409') 
                        this.$parent.$refs.Header.logout();
                    else {
                        if (name != updateResult.name)
                            alert('Name is already used');
                        this.closeModal();
                        this.$parent.updateResources();
                    }
                });
                
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