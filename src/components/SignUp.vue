<template>
  <div class="background">
    <v-col cols="12">
    <v-row>
      <v-col cols="12" md="6" sm="4" xs="12">
        <v-flex>
        <div>
          <span class="tempo">Tempo</span>
          <div style="text-align:middle" :style="$vuetify.breakpoint.mdAndUp && 'margin-top:40px'">
            <span class="textcolor">Transparancy without disruption</span>
          </div>
          <div>
            <span class="textl"
              >Copy increase engagement and equality by providing holistic
              recognition</span
            >
          </div>
          <div style="text-align:center">
            <img  src="@/assets/group.png"/>
          </div>
        </div>
        </v-flex>
      </v-col>
  
      <v-col cols="12" md="4" sm="8" xs="12">
        <v-spacer :style="$vuetify.breakpoint.mdAndUp && 'margin-top:20%'"></v-spacer>

        <div>
          <span class="createaccountxt">Create an account</span>
        </div>
        <v-form>
          <v-container>
            <v-col cols="12" :style="$vuetify.breakpoint.smAndUp && 'margin-left:20%'">
              <v-row>
                <v-text-field
                  class="namefield"
                  label="first name"
                  rounded
                  solo                  
                ></v-text-field>
                <div style="width:20px"></div>
                <v-text-field
                  class="namefield"
                  label="last name"
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
              ></v-text-field>
              </v-row>
              <v-row>
              <v-text-field
                class="namefieldelse"
                label="company title "
                solo
                rounded
              ></v-text-field>
              </v-row>
              <v-row>
              <v-text-field
                class="namefieldelse"
                label="password"
                solo
                rounded
              ></v-text-field>
              </v-row>
              <div>
                <p class="signuptext" @click="onSignUp">sign up</p>
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
  components: {},

  data: () => ({
    content: "<h1>Some initial content</h1>",
  }),
};
</script>

<style>

.tempo {
  font-family: "Righteous", cursive;
  color: rgba(251, 251, 252, 1);
  font-weight: 300;
  font-size: 50px;
  padding: 10px;
  width: 199.8px;
  height: 60.85px;
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  line-height: 62px;
  text-align: center;
}
.signuptext {
  color: rgba(251, 251, 252, 1);
  display: flex;
  justify-content: center;
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
  color: rgba(34, 47, 99, 1);
  display: flex;
  width: 10vw;
  flex: 1 1 auto;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
}
.namefieldelse {
  align-items: flex-start;
  color: rgba(34, 47, 99, 1);
  display: flex;
  /* flex: 1 1 auto; */
  /* letter-spacing: normal; */
  max-width: 100%;
  text-align: left;
}
.background {
  background-color: rgba(22, 34, 79, 1);
  width: 100%;
  height: auto!important;
}
.groupimg {
  width: 70vh;
  display: flex;
  /* margin-left: 15vw; */
  /* margin-top: 35vh; */
  align-items: right;
  text-align: center;
}
.arrowimg {
  /* width: 3vw; */
  display: flex;
  /* margin-left: 49vw; */
  margin-top: 5vh;
}
.createaccountxt {
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
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
}
</style>
