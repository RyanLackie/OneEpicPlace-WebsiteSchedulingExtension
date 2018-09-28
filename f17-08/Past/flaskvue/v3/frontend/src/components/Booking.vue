<template>
<div>
    <v-card style="padding: 50px" width=600px>
        <v-card-text>
            <v-form>
                <v-menu
                ref="menu"
                lazy
                :close-on-content-click="false"
                v-model="menu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="date"
                >
                    <v-text-field
                        slot="activator"
                        label="Picker in menu"
                        v-model="date"
                        prepend-icon="event"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
                <v-select label="Select a room" v-model="room" prepend-icon="home" :items="this.$store.state.rooms"></v-select>
                <v-menu
                    ref="menu2"
                    lazy
                    :close-on-content-click="false"
                    v-model="menu2"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    :return-value.sync="timeStart"
                >
                    <v-text-field
                    slot="activator"
                    label="Pick a start time"
                    v-model="timeStart"
                    prepend-icon="access_time"
                    readonly
                    ></v-text-field>
                    <v-time-picker v-model="timeStart" @change="$refs.menu2.save(timeStart)"></v-time-picker>
                </v-menu>
                <v-menu
                    ref="menu3"
                    lazy
                    :close-on-content-click="false"
                    v-model="menu3"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    :return-value.sync="timeEnd"
                >
                    <v-text-field
                    slot="activator"
                    label="Pick an end time"
                    v-model="timeEnd"
                    prepend-icon="access_time"
                    readonly
                    ></v-text-field>
                    <v-time-picker v-model="timeEnd" @change="$refs.menu3.save(timeEnd)"></v-time-picker>
                </v-menu>
                <v-btn @click="submitEvent">
                    Submit Event
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</div>
</template>

<script>
export default {
    data: () => ({
        date: null,
        room: null,
        menu: false,
        modal: false,
        menu2: false,
        menu3: false,
        timeStart: null,
        timeEnd: null
    }),
    methods: {
        submitEvent() {
            var datefix = this.date
            datefix = datefix.replace("-", "/")
            datefix = datefix.replace("-", "/")
            this.$store.commit('addEvent', {
                date: datefix,
                title: String(this.room),
                desc: String(this.timeStart) + " - " + String(this.timeEnd)
            })
        }
    }
};
</script>

<style>

</style>
