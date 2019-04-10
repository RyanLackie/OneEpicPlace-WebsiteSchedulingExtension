<template>
    <div class="ViewLocationModal" id="ViewLocationModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Edit Location</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewLocationModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Name</label>
                <input type="text" class="input-box form-control" id="ViewLocationModal-Name" placeholder="Location's Email">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Point Cost</label>
                <input type="number" class="input-box form-control" id="ViewLocationModal-PointCost" placeholder="Location's Point Cost">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Type</label>
                <select id="ViewLocationModal-Type" class="form-control" required>
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
    @import "./css/ViewLocationModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                location: null
            }
        },

        methods: {
            openModal(location) {
                //Data
                this.location = location;
                
                //Fields
                document.getElementById("ViewLocationModal-Name").value = location.name;
                document.getElementById("ViewLocationModal-PointCost").value = location.pointCost;
                document.getElementById("ViewLocationModal-Type").value = location.type;

                //Scroll
                document.getElementById('ViewLocationModal').scrollTo(0, 0);

                document.getElementById("ViewLocationModal").style.opacity = "1.0";
                document.getElementById("ViewLocationModal").style.visibility = "visible";
            },
            closeModal() {
                //location
                this.location = null;

                document.getElementById("ViewLocationModal").style.opacity = "0.0";
                document.getElementById("ViewLocationModal").style.visibility = "hidden";
            },
            
            updateLocation(event) {
                var id = this.location.id;
                var previousName = this.location.name;
                var name = document.getElementById("ViewLocationModal-Name").value;
                var pointCost = document.getElementById("ViewLocationModal-PointCost").value;
                var type = document.getElementById("ViewLocationModal-Type").value;
                
                api.admin_UpdateLocation(id, previousName, name, pointCost, type).then(updateResult => {
                    if (updateResult == '409') 
                        this.$parent.$refs.Header.logout();
                    else {
                        if (name != updateResult.name)
                            alert('Name is already used');
                        this.closeModal();
                        this.$parent.updateLocations();
                    }
                });
                
                //Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('ViewLocationModal-Form').addEventListener('submit', this.updateLocation);
        }
    }
</script>