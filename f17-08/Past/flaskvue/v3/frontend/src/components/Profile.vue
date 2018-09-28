<!--Only Stage at this component-->
<template>
    <v-container grid-list-xl text-xs-left>
        <v-layout row wrap>
            <v-flex sm10 offset-xs1>
                <span class="headline">Profile</span>
                <v-card>
                    <v-card-text>
                        <v-avatar id="profilePic"
                            size="100px"
                        >
                            <img 
                                :src="this.$store.state.user.avatar"
                                alt=""
                                v-if="this.$store.state.user.avatar"
                                >
                        </v-avatar> 
                        <ul>
                            <li>
                                <span class="subheading">
                                    <strong>
                                        {{this.$store.state.user.firstName}} {{this.$store.state.user.lastName}}
                                    </strong>
                                </span>
                            </li>
                            <li>
                                 <strong>Phone: </strong> {{this.$store.state.user.phone}} 
                            </li>
                            <li>
                                 <strong>Email: </strong> {{this.$store.state.user.email}} 
                            </li> 
                            <li>
                                 <strong>Website: </strong> {{this.$store.state.user.website}} 
                            </li>
                            <li>
                                 <strong>Date Joined: </strong> {{this.$store.state.user.dateJoined}} 
                            </li>
                        </ul>
                    </v-card-text>
                        <v-card-text>
                           
                        </v-card-text>
                </v-card>
            </v-flex>
            <v-flex sm10 offset-xs1>
                <span class="headline">Membership</span>
                <v-card>
                    <v-card-text>
                        <ul>
                            <li>
                                <strong>Member Code:</strong> {{this.$store.state.user.memberCode}}
                            </li>
                            <li>
                                <strong>Membership Type:</strong> {{this.$store.state.user.memberType}} 
                            </li>
                            <li>
                                <strong>Points:</strong> {{this.$store.state.user.points}}
                            </li>
                            <li>
                                <strong>Period Month:</strong> {{this.$store.state.user.periodMonth}}
                            </li>
                            <li>
                                <strong>Recurring:</strong> {{this.$store.state.user.recurring}}
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: "profile-page"
};
</script>

<style>
#profilePic {
  margin: 10px;
}
ul {
  list-style-type: none;
}
</style>
