<template>
    <div class='container'>
        <div class="row" style='text-align: center; border-bottom: 1px black solid;'>
            <div class="col">Locations</div>
            <div class="col">Hours Booked</div>
            <div class="col">Activity</div>
            <div class="col">Users</div>
            <div class="col">Resources</div>
        </div>

        <div v-for="(location, index) in $parent.selectedLocations" :key="'location:'+location.id"
        class="row align-items-center" :style='"min-height: 100px; text-align: center; "+$parent.styleRow(index)'>
            <div class="col">
                <div class="text-container">
                    <div class="col-text">
                        {{location.name}}
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="text-container">
                    <div class="col-text">
                        {{Math.round(100 * location.hours) / 100}}
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="bar-graph">
                    <div class="bar-graph--bar" v-for="(bar, index) in location.activity" :key="'bar:'+index"
                    :style="$parent.styleBar(bar, location.activity)"></div>
                    <div class="bar-graph--time" v-for="(bar, index) in location.activity" :key="'time:'+index">
                        {{$parent.getBarTime(index)}}
                    </div>
                </div>
            </div>
            <div class="col">
                <select style='width: 100%;'>
                    <option v-for="(user, index) in location.users" :key="'user:'+index">
                        {{$parent.getUserName(user.id) + '   |   hours: ' + user.hours}}
                    </option>
                </select>
            </div>
            <div class="col">
                <select style='width: 100%;'>
                    <option v-for="(resource, index) in location.resources" :key="'resource:'+index">
                        {{$parent.getResourceName(resource.id) + '   |   hours: ' + resource.hours}}
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

</script>