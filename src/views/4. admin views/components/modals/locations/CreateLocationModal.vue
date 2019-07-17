<template>
    <div class="PopUpModal CreateLocationModal" id="CreateLocationModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Create Location</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateLocationModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" id="CreateLocationModal-Name" placeholder="Location's Name" required>

            <label class="label-sm">Point Cost</label>
            <input type="number" class="input-box form-control" id="CreateLocationModal-Cost" placeholder="Location's Point Cost" required>

            <label class="label-sm">Type</label>
            <select id="CreateLocationModal-Type" class="form-control" required>
                <option value='room'>Room</option>
                <option value='desk'>Desk</option>
            </select>

            <label class="label-sm">Color</label>
            <select id="CreateLocationModal-Color" class="form-control" required>
                <option value='Aqua'>Aqua</option>
                <option value='green'>Green</option>
                <option value='yellow'>Yellow</option>
                <option value='indigo'>Indigo</option>
                <option value='teal'>Teal</option>
                <option value='mediumorchid'>Medium Orchid</option>
                <option value='red'>Red</option>
                <option value='cyan'>Cyan</option>
                <option value='lightpink'>Light Pink</option>
                <option value='darkgoldenrod'>Brown</option>
                <option value='darkgreen'>Dark Green</option>
            </select>

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./LocationModals.css";
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
                document.getElementById("CreateLocationModal-Cost").value = 0;
                document.getElementById("CreateLocationModal-Type").value = 'room';
                document.getElementById("CreateLocationModal-Color").value = 'blue';

                //Scroll
                document.getElementById('CreateLocationModal').scrollTo(0, 0);

                document.getElementById("CreateLocationModal").style.opacity = "1.0";
                document.getElementById("CreateLocationModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("CreateLocationModal").style.opacity = "0.0";
                document.getElementById("CreateLocationModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            createLocation(event) {
                var name = document.getElementById("CreateLocationModal-Name").value;
                var cost = document.getElementById("CreateLocationModal-Cost").value;
                var type = document.getElementById("CreateLocationModal-Type").value;
                var color = document.getElementById("CreateLocationModal-Color").value;
                
                api.admin_CreateLocation(name, cost, type, color).then(createResult => {
                    if (createResult == '100') {
                        this.close();
                        this.$parent.updateLocations();
                    }
                    else if (createResult == '406')
                        alert('Location name is already taken');
                    else if (createResult == '404') 
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