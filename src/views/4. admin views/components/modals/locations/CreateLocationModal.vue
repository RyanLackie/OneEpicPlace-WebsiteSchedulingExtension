<template>
    <div class="CreateLocationModal" id="CreateLocationModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Create Location</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateLocationModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Name</label>
                <input type="text" class="input-box form-control" id="CreateLocationModal-Name" placeholder="Location's Name">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Point Cost</label>
                <input type="number" min='0' class="input-box form-control" id="CreateLocationModal-PointCost" placeholder="Location's Point Cost">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Type</label>
                <select id="CreateLocationModal-Type" class="form-control" required>
                    <option value='room'>Room</option>
                    <option value='desk'>Desk</option>
                </select>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/CreateLocationModal.css";
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
                document.getElementById("CreateLocationModal-Name").value = '';
                document.getElementById("CreateLocationModal-PointCost").value = 0;
                document.getElementById("CreateLocationModal-Type").value = 'room';

                //Scroll
                document.getElementById('CreateLocationModal').scrollTo(0, 0);

                document.getElementById("CreateLocationModal").style.opacity = "1.0";
                document.getElementById("CreateLocationModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("CreateLocationModal").style.opacity = "0.0";
                document.getElementById("CreateLocationModal").style.visibility = "hidden";
            },
            
            createLocation(event) {
                var name = document.getElementById("CreateLocationModal-Name").value;
                var pointCost = document.getElementById("CreateLocationModal-PointCost").value;
                var type = document.getElementById("CreateLocationModal-Type").value;
                
                api.admin_CreateLocation(name, pointCost, type).then(createResult => {
                    if (createResult == '100') {
                        this.closeModal();
                        this.$parent.updateLocations();
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
            document.getElementById('CreateLocationModal-Form').addEventListener('submit', this.createLocation);
        }
    }
</script>