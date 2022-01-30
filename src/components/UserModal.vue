<template @scroll="scroll($event)">
  <ion-page>
    <ion-content class="modaled ion-padding">
      <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
      <div class="backbutton" :style="{ background: backgroundColor }">
        <ion-back-button
          default-href="explore"
          @click="closeModal"
        ></ion-back-button>
      </div>
      <div class="user-header" :style="{ background: backgroundColor }">
        <ion-avatar class="pfp" :style="`border: 3px solid ${textColor};`">
          <img :src="pfp" />
          <ion-spinner v-if="loading" />
        </ion-avatar>
        <br />
        <ion-text color="white" class="username">
          <h1>{{ username }}</h1>
        </ion-text>
        <ion-text
          class="under-pfp"
          v-if="!loading"
          :style="{ color: textColor }"
          >Joined {{ joinDate
          }}<span v-if="followers != 'dontshow'">
            • {{ followers }} followers</span
          >
        </ion-text>
        <p><br /></p>
      </div>
      <!--
      <ion-card class="top-shift text-box ion-padding">
        <ion-card-content>
          <ion-card-title>Activity</ion-card-title>
          <div v-for="a in activity" :key="a">
            {{ a.user }} {{ a.action }} <a :href="a.target.link">{{ a.target.title }}</a>
          </div>
        </ion-card-content>
      </ion-card>
      !-->
      <ProjectCard
        :title="featuredProject.title"
        :author="featuredProject.author"
        :thumb="featuredProject.thumbnail"
        :id="featuredProject.id"
      />
      <ion-card
        :class="[
          'text-box',
          'ion-padding',
          'top-shift',
          { selected: selected == 'about' },
        ]"
        v-if="bio.about.length > 0"
      >
        <ion-card-content @click="select('about')">
          <ion-card-title>About Me</ion-card-title>
          <div v-safe-html="bio.about"></div>
        </ion-card-content>
        <div class="shadow" v-if="selected != 'about'"></div>
      </ion-card>
      <ion-card
        :class="['text-box', 'ion-padding', { selected: selected == 'wiwo' }]"
        v-if="bio.wiwo.length > 0"
      >
        <ion-card-content @click="select('wiwo')">
          <ion-card-title>What I'm Working On</ion-card-title>
          <div v-safe-html="bio.wiwo"></div>
        </ion-card-content>
        <div class="shadow" v-if="selected != 'wiwo'"></div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
// const utils = require('../utils.js');
import ProjectCard from "@/components/ProjectCard.vue";
import { parse } from "node-html-parser";
//import * as Vibrant from 'node-vibrant';
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { useRouter } from "vue-router";
const { Http } = Plugins;
import {
  IonPage,
  IonProgressBar,
  IonContent,
  IonBackButton,
  modalController,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonText,
  IonSpinner,
  IonAvatar,
} from "@ionic/vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserModal",
  props: {
    username: {
      type: String,
      default: "loading...",
    },
    id: Number,
  },
  data() {
    return {
      joinDate: "",
      followers: 0,
      backgroundColor: "#303c54",
      textColor: "white",
      loading: true,
      activity: [],
      bio: {
        wiwo: "",
        about: "",
      },
      pfp: "./assets/avatar.png",
      selected: null,
      featuredProject: {},
    };
  },
  components: {
    IonPage,
    IonProgressBar,
    IonContent,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonText,
    IonSpinner,
    IonAvatar,
    ProjectCard,
  },
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
  mounted() {
    this.router.push("/user/" + this.username);
    App.addListener("backButton", () => {
      this.closeModal();
    });
    this.loadUser();
  },
  methods: {
    select(item) {
      console.log("Selected", item);
      this.selected = item;
    },
    closeModal() {
      StatusBar.setBackgroundColor({
        color: "#121212",
      });
      modalController.dismiss();
    },
    scroll(e) {
      console.log(e);
    },
    async loadUser() {
      let user,
        userActivity = {},
        loadingStatus = 0;
      const isLoading = () => {
        console.log(loadingStatus);
        if (loadingStatus > 2) {
          this.loading = false;
          return false;
        } else {
          return true;
        }
      };
      Http.request({
        method: "GET",
        url: `https://scratch.mit.edu/site-api/users/all/${this.username}`,
      }).then((res) => {
        this.featuredProject = {
          label: res.data.featured_project_label_name,
          author: res.data.featured_project_data.creator,
          title: res.data.featured_project_data.title,
          thumbnail: res.data.featured_project_data.thumbnail_url,
          id: res.data.featured_project_data.id,
        };
      });
      Http.request({
        method: "GET",
        url: `https://itchy-api.vercel.app/api/user?user=${this.username}`,
      }).then((res) => {
        loadingStatus++;
        isLoading();
        user = res.data;
        let fake = document.createElement("img");
        fake.src = `https://cdn2.scratch.mit.edu/get_image/user/${user.id}_500x500.png`;
        fake.onload = () => {
          /*
          Http.request({
            method: 'GET',
            url: `https://itchy-api.vercel.app/api/image?url=https://cdn2.scratch.mit.edu/get_image/user/${userStats.id}_500x500.png`
          }).then((img) => {
            let image = new Image();
            image.src = `data:image/png;base64,${img.data.data}`;
            let v = new Vibrant(image.src);
            console.log('Vibrant:', v);
            v.getPalette((err, palette) => {
              console.log(palette)
              this.backgroundColor = palette.DarkMuted.getHex();
              this.textColor = palette.LightVibrant.getHex();
              StatusBar.setBackgroundColor({
                color: palette.DarkMuted.getHex()
              });
              this.bio.wiwo = userStats.work;
              this.bio.about = userStats.bio;*/
          this.pfp = `https://cdn2.scratch.mit.edu/get_image/user/${user.id}_500x500.png`;
          loadingStatus++;
          isLoading();
          /*});
          })*/
        };
        this.joinDate = new Date(user.history.joined).toDateString();
        if (user.followers) {
          this.followers = user.followers;
        } else {
          this.followers = "dontshow";
        }
      });
      Http.request({
        method: "GET",
        url: `https://scratch.mit.edu/messages/ajax/user-activity/?user=${this.username}&max=6`,
      }).then((res) => {
        console.log(userActivity);
        loadingStatus++;
        isLoading();
        let unparsed = res.data;
        unparsed = parse(unparsed);
        unparsed = unparsed.querySelectorAll("li");
        for (let i = 1; i <= unparsed.length; i += 2) {
          let obj = {};
          const selected = unparsed[i].querySelector("div");
          obj.user = selected.childNodes[1].innerText;
          obj.action = selected.childNodes[2].innerText
            .replace(/\s+/g, " ")
            .trim();
          obj.target = {
            title: selected.childNodes[3].innerText,
            link: `https://scratch.mit.edu${selected.childNodes[3].getAttribute(
              "href"
            )}`,
          };
          this.activity.push(obj);
        }
        console.log(this.activity);
      });
    },
  },
});
</script>
<style scoped>
.top-shift {
  margin-top: 40px;
}

ion-title {
  margin: auto;
  padding-right: 75px;
  text-align: center;
}

ion-progress-bar {
  transform: translateX(-16px);
}

ion-card-title {
  font-size: 2.5em;
}

::v-deep(ion-card) {
  width: 98%;
  margin: auto;
  max-height: 100% !important;
}

.user-header {
  height: max-content;
  width: calc(100% + 2 * 16px);
  margin: calc(0px - 16px);
  margin-bottom: 15px;
  padding: 15px 0;
  text-align: center;
}

.pfp ion-spinner {
  position: absolute;
  top: calc(50% - 12px);
  left: calc(50% - 12px);
  color: #4d97ff;
}

.user-header .pfp {
  position: relative;
  margin: auto;
  margin-top: 17px;
  background: white;
  height: 90px;
  width: 90px;
  border-radius: 100%;
  /*
  outline: 3px solid transparent;
  outline-offset: 5px;
  */
  box-shadow: 0.4px 6.7px 5.3px -7px rgba(0, 0, 0, 0.028),
    1.3px 22.3px 17.9px -7px rgba(0, 0, 0, 0.042),
    6px 100px 80px -7px rgba(0, 0, 0, 0.07);
  transform: translate(0);
}

.under-pfp {
  margin-bottom: 10px;
  font-size: 0.8em;
}

p {
  margin: 0;
}

.backbutton {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.backbutton ion-back-button {
  float: left;
  padding: 3px;
}

h1 {
  margin-top: 0;
}

ion-progress-bar {
  z-index: 1;
}

ion-card {
  z-index: -1;
  max-height: 18vh;
  transition: max-height 0.3s ease-out;
}

.shadow {
  width: 100%;
  height: 30%;
  background: transparent;
  background: linear-gradient(
    0deg,
    var(--ion-card-background) 10%,
    rgba(0, 0, 0, 0) 100%
  );
  position: absolute;
  bottom: 0;
  left: 0;
}

ion-card.selected {
  max-height: 900% !important;
  transition: max-height 0.3s ease-out;
}
</style>
