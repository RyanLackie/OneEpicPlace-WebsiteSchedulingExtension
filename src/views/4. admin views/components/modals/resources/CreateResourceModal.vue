<template>
    <div class="CreateResourceModal" id="CreateResourceModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Create Resource</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateResourceModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Name</label>
                <input type="text" class="input-box form-control" id="CreateResourceModal-Name" placeholder="Resources's Name" required>
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Quantity</label>
                <input type="number" min='0' class="input-box form-control" id="CreateResourceModal-Quantity" placeholder="Number of this resource availible" required>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/CreateResourceModal.css";
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
            
            createResource(event) {
                var name = document.getElementById("CreateResourceModal-Name").value;
                var quantity = document.getElementById("CreateResourceModal-Quantity").value;
                
                api.admin_CreateResource(name, quantity).then(createResult => {
                    if (createResult == '100') {
                        this.closeModal();
                        this.$parent.updateResources();
                    }
                    if (createResult == '408')
                        alert('Name is already taken');
                    else if (createResult == '409') 
                        this.$parent.$refs.Header.logout();
                });
                
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