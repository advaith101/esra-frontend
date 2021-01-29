<template>
    <div class="login-page ">
        <div class="child"> 
            <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">     

        <v-img class="logo" width="174px" height="81px" :src="require('@/assets/logo.png')"></v-img>
        <v-card elevation="0"   height="284px" style="margin-top:15px">
            <!-- <h3>Login</h3> -->
            <v-form ref="form"  >
                 <v-text-field
                    v-model="userName"
                    label="Username"
                    outlined
                    dense
                    :rules="userRules"
                    required
                    width="100%"
                 ></v-text-field>
                 <v-text-field
                    v-model="pwd"
                    label="Password"
                    outlined
                    dense
                    :rules="pwdRules"
                    :type="'password'"
                    required
                    v-on:keyup.enter="validate"
                 ></v-text-field>
                 <div style="margin-top:-15px">
                 <span class="forgotpassword" style="cursor:pointer">Forgot Password?</span>
                 </div>
                 <br/>
                 <v-btn style="margin-top:10px" color="indigo" dark @click="validate">Login</v-btn>
            </v-form>
        </v-card>
          </v-col>
        </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
export default {

    data() {
        return{
            userName:'',
            userRules:[
                v => !!v || 'Name is required'
            ],
            pwd:'',
            pwdRules:[
                v => !!v || 'Password is required'
            ]
        }
        
    },

    methods:{
        async validate () {
            if(this.$refs.form.validate()){
                try {
                    var res = await this.$apiService.post('/users/ValidateLogin',{
                            email:this.userName,
                            password:this.pwd
                        });
                    localStorage.setItem('userid',res.data.user.UserID)
                    localStorage.setItem('token',res.data.token);
                    localStorage.setItem('refreshtoken',res.data.refreshToken);
                    localStorage.setItem('userName',res.data.user.Name)
                    localStorage.setItem('userEmail',this.userName)
                    this.$router.replace('/home');
                    
                }
                catch(error){ console.log(error); }
            }
        }
    }

}
</script>

<style >

.login-page{
    height: 100%;
    
}

.logo {
    margin-left: 24%;
}

.child {
    position: relative;
    top: 20%;    
}
.forgotpassword {
    font-size: 12px;
line-height: 16px;
text-align: center;
text-decoration-line: underline;
color: #828288;
cursor: pointer !important; 
z-index: 500;
}
</style>