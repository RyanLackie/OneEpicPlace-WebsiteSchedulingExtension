<template>
    <div class='container'>
        <div class="row" style='text-align: center; border-bottom: 1px black solid;'>
            <div class="col">
                {{viewType}}
            </div>
            <div class="col">Hours Booked</div>
            <div class="col">Activity</div>
            <div class="col" v-if='viewType !== "Users"'>Users</div>
            <div class="col" v-if='viewType !== "Locations"'>Locations</div>
            <div class="col" v-if='viewType !== "Resources"'>Resources</div>
        </div>

        <div v-for="(data, index) in getViewData()" :key="'data:'+data.id"
        class="row align-items-center" :style='"min-height: 100px; text-align: center; "+$parent.styleRow(index)'>
            <div class="col">
                <div class="text-container">
                    <div class="col-text">
                        {{viewType === "Users" ? data.username : data.name}}
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="text-container">
                    <div class="col-text">
                        {{Math.round(100 * data.hours) / 100}}
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="bar-graph">
                    <div class="bar-graph--bar" v-for="(bar, index) in data.activity" :key="'bar:'+index"
                    :style="$parent.styleBar(bar, data.activity)"></div>
                    <div class="bar-graph--time" v-for="(bar, index) in data.activity" :key="'time:'+index">
                        {{$parent.getBarTime(index)}}
                    </div>
                </div>
            </div>

            <div v-if='viewType !== "Users"' class="col">
                <select style='width: 100%;'>
                    <option v-for="(user, index) in data.users" :key="'user:'+index">
                        {{user.username + '   |   hours: ' + user.hours}}
                    </option>
                </select>
            </div>

            <div v-if='viewType !== "Resources"' class="col">
                <select style='width: 100%;'>
                    <option v-for="(resource, index) in data.resources" :key="'resource:'+index">
                        {{resource.name + '   |   hours: ' + resource.hours}}
                    </option>
                </select>
            </div>

            <div v-if='viewType !== "Locations"' class="col">
                <select style='width: 100%;'>
                    <option v-for="(location, index) in data.locations" :key="'location:'+index">
                        {{location.name + '   |   hours: ' + location.hours}}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
    .bar-graph {
        height: 40px;
        .bar-graph--bar {
            display: inline-block;
            width: 6.666%;
        }
        .bar-graph--time {
            display: inline-block;
            width: 6.666%;
            margin-top: -3px;
            letter-spacing: -2px;
            font-size: 13px;
        }
    }
    .text-container {
        position: absolute;
        width: 100%;
        height: 100%;
        .col-text {
            padding: 0px 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            pointer-events: none;
        }
    }
</style>


<script>
    export default {
        props: ['viewType'],
        methods: {
            getViewData() {
                if (this.viewType === 'Users') {
                    return this.$parent.selectedUsers;
                }
                else if (this.viewType === 'Locations') {
                    return this.$parent.selectedLocations;
                }
                else if (this.viewType === 'Resources') {
                    return this.$parent.selectedResources;
                }
            }
        }
    }
</script>