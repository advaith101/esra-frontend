<template>
  <div class="background">
      <v-dialog
      v-model="showOTPpopup"     
      height="200"
       
        :width="$vuetify.breakpoint.mdAndUp?'30%':'100%'"
      persistent             
    >
     <div >
     <v-container fluid style="margin: 0px; padding: 0px; width: 100%;z-index:20001;">
      <!-- <v-row > -->
        <v-form novalidate="true"  >
        <!-- <v-col cols="12"> -->
          <v-card
             style="margin: 0px;  width: 100%;z-index:20001;"  
             class="pa-0 ma-0"              
          >
          <v-card-title class="headline lighten-2">
         <span style="font-size:20px">Enter One Time Password (OTP)</span>
        </v-card-title>
        <div  align="center"    >
        <span style="color:#222F63;font-size:14px;">Please enter the OTP sent to the provided Email ID </span>
        </div>
    <div style="display: flex; flex-direction: row;margin-top:13px;justify-content: center;">
      
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      separator=""
      :num-inputs="6"
      :should-auto-focus="true"
      :is-input-num="true"         
      @on-complete="verifyCode"
    />    
  </div>
           <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
            color="blue darken-1"
            text            
            @click="showOTPpopup = false"
          >
            Close
          </v-btn>
          
             </v-card-actions>
          </v-card>
        <!-- </v-col> -->
        </v-form>
      <!-- </v-row> -->
    </v-container>
     </div>
            </v-dialog> 
    <v-col cols="12" >
    <v-row >
      <v-col cols="12" md="12" sm="12" xs="12" class="pa-0 ma-0">
      <span class="tempo">Tempo</span>
      </v-col>
      <v-col cols="12" md="6" sm="4" xs="12">
        <v-flex>
        <div>

          <div style="text-align:middle" :style="$vuetify.breakpoint.mdAndUp && 'margin-top:40px'">
            <span class="textcolor">Transparancy without disruption</span>
          </div>
          <div>
            <span class="textl"
              >Copy increase engagement and equality by providing holistic
              recognition</span
            >
          </div>
          <div  class="groupimg">
            <v-img height="200" contain src="@/assets/group.png"></v-img>
          </div>
        </div>
        </v-flex>
      </v-col>

      <v-col cols="12" md="4" sm="8" xs="12">
        <v-spacer :style="$vuetify.breakpoint.mdAndUp && 'margin-top:15%'"></v-spacer>

        <div>
          <span class="createaccountxt">Create an account</span>
        </div>
        <v-form ref="entryForm">
          <v-container>
            <v-col cols="12" :style="$vuetify.breakpoint.smAndUp && 'margin-left:20%'">
              <v-row>
                <v-text-field
                  class="namefield"
                  label="first name"
                  rounded
                  v-model="firstName"
                  :rules="[rules.required]"
                  solo
                ></v-text-field>
                <div style="width:20px"></div>
                <v-text-field
                  class="namefield"
                  label="last name"
                  v-model="lastName"
                  :rules="[rules.required]"
                  solo
                  rounded
                ></v-text-field>
              </v-row>
              <v-row>
              <v-text-field
                class="namefieldelse"
                label="email"
                solo
                rounded           
                v-model="email"
                :rules="[rules.required].concat(emailRules)"
              ></v-text-field>
              </v-row>
              <v-row>
              <v-text-field
                class="namefieldelse"
                label="company title "
                v-model="title"
                :rules="[rules.required]"
                solo
                rounded
              ></v-text-field>
              </v-row>
              <v-row>
              <v-text-field
                class="namefieldelse"
                label="password"
                v-model="password"
                  :rules="passwordRules"                 
                solo
                rounded
                :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append="() => (hidePassword = !hidePassword)"
    :type="hidePassword ? 'password' : 'text'" 
              ></v-text-field>
              </v-row>
              <div>
                <p class="signuptext" @click="signup">sign up</p>
              </div>
            </v-col>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <div>
      <v-img class="arrowimg" contain height="50" src="@/assets/vector.png"></v-img>
    </div>

    <v-row>
      <!-- <div> -->
      <p class="textbottom">
        so, whats your <span class="tempo1">Tempo</span> <span>?</span>
      </p>

        <v-img class="downloadicon"  contain height="50" src="@/assets/download.png"/>
      <!-- </div> -->
    </v-row>
    <v-spacer style="height: 20vh;"></v-spacer>
    </v-col>
  </div>
</template>

<script>
export default {
  data: () => ({
    firstName:null,
    lastName:null,
    email:null,
    title:null,
    password:null,
    roleID:2,
    hidePassword:true,
    showOTPpopup:true,
    rules: {required: (value) => !!value || "Required."},
    verificationCode:null,
   emailRules: [ v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Invalid Email address' ],
   passwordRules: [
       // (value) => !!value || 'Please type password.',        
        (value) => !value || /[a-z]+/.test(value) || 'One lowercase character is needed',
        (value) => !value || /[A-Z]+/.test(value) || 'One uppercase character is needed',
        (value) => !value || /[0-9]+/.test(value) || 'One number is needed',       
        (value) => !value || value.length >= 8 || 'Minimum 8 characters',
        (value) => !value || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)!==false || 'One special character is needed'
      ],   

  }),
  mounted() {
    this.roleID = this.$route.params.roleID ? this.$route.params.roleID : 2;    
  },
  methods:{
    async verifyCode(verificationCode) {
      this.verificationCode = verificationCode;
      this.signup();
    },
async signup(){
      let self = this;
      if (!self.$refs.entryForm.validate()) {       
        return;
      }  
    var postData ={
      firstName: this.firstName,
      lastName: this.lastName,
      emailID: this.email,
      jobTitle: this.title,
      password: this.password,
      role: this.roleID,
      companyID: 1,
      verificationCode: this.verificationCode
    }
     var res = await this.$apiService.post('/common/signup',postData);
     if (res.status === 200) {
       if (postData.verificationCode !== undefined && postData.verificationCode !== null) {
              this.showSuccess("You are registered successfully");          
            this.$router.push('/');
            } else {
              this.showOTPpopup = true;
            }
     }  
}
  }
};
</script>

<style>

.tempo {
  font-family: "Righteous", cursive;
  color: rgba(251, 251, 252, 1);
  font-weight: 300;
  font-size: 50px;
  /* padding: 10px; */
  /* width: 199.8px;
  height: 60.85px; */
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  /* line-height: 62px; */
  float: left;
  margin-left:20px;


}
.signuptext {
  color: rgba(251, 251, 252, 1);
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.downloadicon {
  /* width: 12vh; */
  margin-top: 120px;
  margin-left: -100px;
  /* position: absolute; */
}
.tempo1 {
  font-family: "Righteous", cursive;
  color: rgba(251, 251, 252, 1);
  font-weight: 300;
  font-size: 50px;
  /* width: 199.8px;
  height: 60.85px; */
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  /* line-height: 62px; */
  text-align: center;
}
.namefield {
  align-items: flex-start;
  /* color: rgba(34, 47, 99, 1); */
  color:#ffffff;
  display: flex;
  width: 10vw;
  flex: 1 1 auto;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
}
.namefieldelse {
  align-items: flex-start;
  /* color: rgba(34, 47, 99, 1); */
  display: flex;
  /* flex: 1 1 auto; */
  /* letter-spacing: normal; */
  max-width: 100%;
  text-align: left;
}
.background {
  background-color: rgba(22, 34, 79, 1) !important;
  width: 100%;
  min-height: 100vh!important;
}
.groupimg {
  /* width: 70vh; */
  display: flex;
  /* margin-left: 15vw; */
  margin-top: 5%;
  align-items: right;
  text-align: center;
}
.arrowimg {
  /* width: 3vw; */
  display: flex;
  /* margin-left: 49vw; */
  margin-top: 3vh;
}
.createaccountxt {
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
  margin-left: -30px;
}
.textbottom {
  /* width: 561px;
  height: 90px; */
  color: rgba(255, 255, 255, 1);
  font-size: 50px;
  line-height: 90px;
  margin-left: 5vw;
  margin-top: 100px;
}
.textcolor {
  color: rgba(251, 251, 252, 1);
  /* position: absolute;
  margin-top: 7vw;
  margin-left: 13vw;
  width: 613px;
  height: 30px;
  font-family: Suwannaphum; */
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  /* line-height: 54px; */
  /* display: flex;
  align-items: center; */
  text-align: right;
}
.textl {
  color: rgba(251, 251, 252, 1);
  /* position: absolute;
  width: 421px;
  height: 30px;
  margin-top: 23vh;
  margin-left: 13vw;
  font-family: Suwannaphum; */
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  /* line-height: 29px;
  display: flex;
  align-items: center; */
  text-align: right;
}
/* .v-icon.v-icon {
  padding-top: 4px;
  padding-left: 2px;
  padding-right: 2px;
} */

/* .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
    background: #222F63;
    color: #ffffff !important;
} */
@media (max-width: 768px) {
  .downloadicon {
  /* width: 12vh; */
  margin-top: 10px;
  margin-left: 10px;
  /* position: absolute; */
}
.textbottom {
  /* width: 561px;
  height: 90px; */
  color: rgba(255, 255, 255, 1);
  font-size: 50px;
  line-height: 90px;
  margin-left: 5vw;
  margin-top: 50px;
}
.createaccountxt {
  margin-left:auto;
}
}
</style>
