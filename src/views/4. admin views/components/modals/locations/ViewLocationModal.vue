<template>
    <div class="PopUpModal ViewLocationModal" id="ViewLocationModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Edit Location</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewLocationModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" id="ViewLocationModal-Name" placeholder="Location's Name" required>

            <label class="label-sm">Point Cost</label>
            <input type="number" class="input-box form-control" id="ViewLocationModal-Cost" placeholder="Location's Point Cost" required>

            <label class="label-sm">Type</label>
            <select id="ViewLocationModal-Type" class="form-control" required>
                <option value='room'>Room</option>
                <option value='desk'>Desk</option>
            </select>

            <label class="label-sm">Color</label>
            <select id="ViewLocationModal-Color" class="form-control" required>
                <option value='Aqua'>Aqua</option>
                <option value='Green'>Green</option>
                <option value='Yellow'>Yellow</option>
                <option value='Indigo'>Indigo</option>
                <option value='Teal'>Teal</option>
                <option value='MediumOrchid'>Medium Orchid</option>
                <option value='Red'>Red</option>
                <option value='Cyan'>Cyan</option>
                <option value='LightPink'>Light Pink</option>
                <option value='DarkGoldenRod'>Brown</option>
                <option value='DarkGreen'>Dark Green</option>
            </select>

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">

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
                document.getElementById("ViewLocationModal-Cost").value = location.cost;
                document.getElementById("ViewLocationModal-Type").value = location.type;
                document.getElementById("ViewLocationModal-Color").value = location.color;

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
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            updateLocation(event) {
                var id = this.location.id;
                var previousName = this.location.name;
                var name = document.getElementById("ViewLocationModal-Name").value;
                var cost = document.getElementById("ViewLocationModal-Cost").value;
                var type = document.getElementById("ViewLocationModal-Type").value;
                var color = document.getElementById("ViewLocationModal-Color").value;
                
                api.admin_UpdateLocation(id, previousName, name, cost, type, color).then(
                    updateResult => {
                        if (updateResult == '404') 
                            this.$parent.$refs.Header.logout();
                        else {
                            if (name != updateResult.name)
                                alert('Location name is already in use');
                            else {
                                this.close();
                                this.$parent.updateLocations();
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
            document.getElementById('ViewLocationModal-Form').addEventListener('submit', this.updateLocation);
        }
    }
</script>