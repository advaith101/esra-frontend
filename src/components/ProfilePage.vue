<template>
    <v-container fill-height class="profile-page-container">
        <v-row >
            <v-flex align-self-start>
                <v-col>
                    <v-avatar size="200">
                        <img :src= "`${getUserDetails().profilepic_path}`">
                    </v-avatar>
                    <v-row justify="center">
                        <v-img max-height="30" max-width="30" contain :src="require('@/assets/icons/edit-1.png')" class="img-buttons" />
                        <v-img max-height="30" max-width="30" contain :src="require('@/assets/icons/delete-1.png')" class="img-buttons" />
                    </v-row>
                </v-col>
            </v-flex>
            <v-flex>
                <v-card class="form-card pa-5" align="center" justify="center" >
                    <v-card-title class="text-h5 font-weight-bold">Account Information</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-form>
                            <v-text-field dense outlined required class="text-body-1" label="First Name" v-model="first_name" ></v-text-field>
                            <v-text-field dense outlined required class="text-body-1" label="Last Name" v-model="last_name"></v-text-field>
                            <v-text-field dense outlined required class="text-body-1" label="Email" v-model="email"></v-text-field>
                            <v-text-field dense outlined required class="text-body-1" label="New Password" type="password" v-model="password"></v-text-field>
                            <v-text-field dense outlined required class="text-body-1" label="Confirm Password" type="password" v-model="re_password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text outlined large class="save-btn">Save</v-btn>
                        <v-btn text outlined large @click="$router.go(-1)" >Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            first_name: localStorage.getItem("userName"),
            last_name: 'Bakharan',
            email: this.getUserDetails().Email,
            password: '',
            re_password: ''
        }
    }

}
</script>

<style scoped>

.save-btn {
    background-color: #144584;
    color: white;
}
.profile-button {
    height: 32px;
    width: 32px;
    margin:10px 5px;
}

.img-buttons {
    cursor: pointer;
    vertical-align: middle;
    top: 9.5px;
    margin-left: 10px;
}

.profile-page-container {
    background-color: white;
    height: 93vh;
    max-width: 100%;
    overflow-y: scroll!important;
}

.form-card {
    border-color: grey;    
}

</style>