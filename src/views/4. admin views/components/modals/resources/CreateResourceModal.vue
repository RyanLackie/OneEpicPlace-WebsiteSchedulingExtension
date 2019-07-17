<template>
    <div class="PopUpModal CreateResourceModal" id="CreateResourceModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Create Resource</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateResourceModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" id="CreateResourceModal-Name" placeholder="Resources's Name" required>

            <label class="label-sm">Point Cost</label>
            <input type="number" class="input-box form-control" id="CreateResourceModal-Cost" required>

            <label class="label-sm">Quantity</label>
            <input type="number" min='0' class="input-box form-control" id="CreateResourceModal-Quantity" required>

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
                
            }
        },

        methods: {
            openModal() {
                //Fields
                document.getElementById("CreateResourceModal-Name").value = '';
                document.getElementById("CreateResourceModal-Cost").value = 0;
                document.getElementById("CreateResourceModal-Quantity").value = 0;

                //Scroll
                document.getElementById('CreateResourceModal').scrollTo(0, 0);

                document.getElementById("CreateResourceModal").style.opacity = "1.0";
                document.getElementById("CreateResourceModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("CreateResourceModal").style.opacity = "0.0";
                document.getElementById("CreateResourceModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            createResource(event) {
                var name = document.getElementById("CreateResourceModal-Name").value;
                var cost = document.getElementById("CreateResourceModal-Cost").value;
                var quantity = document.getElementById("CreateResourceModal-Quantity").value;
                
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
                
                //Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('CreateResourceModal-Form').addEventListener('submit', this.createResource);
        }
    }
</script>