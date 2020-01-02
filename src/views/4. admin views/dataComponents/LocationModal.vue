<template>
    <div class="PopUpModal LocationModal" id="LocationModal" aria-hidden="true">
                
        <div class="modal-header">
            <div v-if="modalType === 'create'" class="text">Create Location</div>
            <div v-if="modalType === 'update'" class="text">Update Location</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="LocationModal-Form">

            <label class="label-sm">Name</label>
            <input type="text" class="input-box form-control" placeholder="Location's Name" v-model="name" required>

            <label class="label-sm">Lower Point Cost</label>
            <input type="decimal" class="input-box form-control" placeholder="Location's Point Cost" v-model="lowerCost" required>

            <label class="label-sm">Higher Point Cost</label>
            <input type="decimal" class="input-box form-control" placeholder="Location's Point Cost" v-model="higherCost" required>

            <label class="label-sm">Type</label>
            <select class="form-control" v-model="type" required>
                <option value='room'>Room</option>
                <option value='desk'>Desk</option>
            </select>

            <label class="label-sm">Color</label>
            <select class="form-control" v-model="color" required>
                <option value='Aqua'>Aqua</option>
                <option value='Green'>Green</option>
                <option value='Yellow'>Yellow</option>
                <option value='Indigo'>Indigo</option>
                <option value='Teal'>Teal</option>
                <option value='MediumOrchid'>Medium Orchid</option>
                <option value='Red'>Red</option>
                <option value='Cyan'>Cyan</option>
                <option value='LightPink'>Light Pink</option>
                <option value='DarkGoldenRod'>Dark Golden Rod</option>
                <option value='DarkGreen'>Dark Green</option>
            </select>

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    .LocationModal {
        height: 90%;
        max-height: 520px;
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
                lowerCost: null,
                higherCost: null,
                type: null,
                color: null
            }
        },

        methods: {
            openModal(modalType, location) {
                this.modalType = modalType;

                // For update
                if (this.modalType === 'update') {
                    this.id = location.id;
                    this.previousName = location.name;
                    this.name = location.name;
                    this.lowerCost = location.lowerCost;
                    this.higherCost = location.higherCost;
                    this.type = location.type;
                    this.color = location.color;
                }
                // For create
                else {
                    this.name = '';
                    this.lowerCost = 0;
                    this.higherCost = 0;
                    this.type = 'room';
                    this.color = 'Aqua';
                }

                //Scroll
                document.getElementById('LocationModal').scrollTo(0, 0);

                document.getElementById("LocationModal").style.opacity = "1.0";
                document.getElementById("LocationModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("LocationModal").style.opacity = "0.0";
                document.getElementById("LocationModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },

            handelSubmit(event) {
                if (this.modalType === 'create') {
                    this.createLocation();
                }
                else if (this.modalType === 'update') {
                    this.updateLocation();
                }

                //Prevent submit refresh
                event.preventDefault();
            },
            
            createLocation() {
                var name = this.name;
                var lowerCost = this.lowerCost;
                var higherCost = this.higherCost;
                var type = this.type;
                var color = this.color;
                
                api.admin_CreateLocation(name, lowerCost, higherCost, type, color).then(createResult => {
                    if (createResult == '100') {
                        this.close();
                        this.$parent.updateLocations();
                    }
                    else if (createResult == '406')
                        alert('Location name is already taken');
                    else if (createResult == '404') 
                        this.$parent.$refs.Header.logout();
                });
            },

            updateLocation() {
                var id = this.id;
                var previousName = this.previousName;
                var name = this.name;
                var lowerCost = this.lowerCost;
                var higherCost = this.higherCost;
                var type = this.type;
                var color = this.color;
                
                api.admin_UpdateLocation(id, previousName, name, lowerCost, higherCost, type, color).then(
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
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('LocationModal-Form').addEventListener('submit', this.handelSubmit);
        }
    }
</script>