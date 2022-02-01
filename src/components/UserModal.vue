<template>
  <ion-page>
    <ion-content
      class="modaled ion-padding"
      :scroll-events="true"
      @ionScroll="scroll($event)"
    >
      <transition name="opacity">
        <ion-progress-bar
          v-if="loading"
          type="determinate"
          :value="loadingStatus / 6"
        />
      </transition>
      <div class="backbutton" :style="{ background: headerColor }">
        <ion-back-button
          default-href="explore"
          @click="closeModal"
        ></ion-back-button>
        <ion-text>
          <transition name="fade">
            <h2 v-if="showHeader">{{ username }}</h2>
          </transition>
        </ion-text>
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
          ><ion-icon :icon="calendar" /> {{ joinDate
          }}<span class="followers-space" v-if="followers != 'dontshow'"
            ><ion-icon :icon="personAdd" /> {{ followers }}</span
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
        class="featured-project"
        :title="featuredProject.title"
        :author="featuredProject.author"
        :thumb="featuredProject.thumbnail"
        :id="featuredProject.id"
      />
      <ion-card
        :class="['text-box', 'ion-padding', { selected: selected == 'about' }]"
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
      <div v-if="!loading">
        <ion-text>
          <h3>Projects ({{ projectCount }})</h3>
        </ion-text>
        <div class="sidescroll">
          <div v-for="project in userProjects" :key="project.id">
            <ProjectCard
              class="user-projects"
              :title="project.title"
              :author="username"
              :thumb="project.image"
              :id="project.id"
              :instructions="project.instructions"
              :credits="project.description"
            ></ProjectCard>
          </div>
        </div>
        <ion-text>
          <h3>Favorites</h3>
        </ion-text>
        <div class="sidescroll">
          <div v-for="project in favoriteProjects" :key="project.id">
            <ProjectCard
              class="user-projects"
              :title="project.title"
              :author="project.author.username"
              :thumb="project.image"
              :id="project.id"
              :instructions="project.instructions"
              :credits="project.description"
            ></ProjectCard>
          </div>
        </div>
      </div>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-spinner v-if="opening" />
          <ion-icon :icon="exitOutline" @click="openInBrowser" v-else />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
const utils = require("../utils.js");
import ProjectCard from "@/components/ProjectCard.vue";
import { parse } from "node-html-parser";
//import * as Vibrant from 'node-vibrant';
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { Browser } from "@capacitor/browser";
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
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/vue";
import { exitOutline, personAdd, calendar } from "ionicons/icons";
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
      loadingStatus: 0,
      activity: [],
      bio: {
        wiwo: "",
        about: "",
      },
      pfp: "./assets/avatar.png",
      selected: null,
      featuredProject: {},
      showHeader: false,
      headerColor: "transparent",
      opening: false,
      projectCount: "loading",
      userProjects: [],
      favoriteProjects: [],
      exitOutline,
      personAdd,
      calendar,
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
    IonFab,
    IonFabButton,
    IonIcon,
    ProjectCard,
  },
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
  mounted() {
    StatusBar.setBackgroundColor({
      color: this.backgroundColor,
    });
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
      if (e.detail.scrollTop > 135) {
        this.showHeader = true;
        this.headerColor = this.backgroundColor;
      } else {
        this.showHeader = false;
        this.headerColor = "transparent";
      }
    },
    async loadUser() {
      let user,
        userActivity = {};
      this.loadingStatus = 0;
      const isLoading = () => {
        if (this.loadingStatus == 6) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
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
        url: `https://api.scratch.mit.edu/users/${this.username}/favorites?limit=12`,
      }).then((res) => {
        this.loadingStatus++;
        res.data.forEach((project) => {
          Http.request({
            method: "GET",
            url: `https://api.scratch.mit.edu/projects/${project.id}`,
          }).then((res) => {
            if (!res.error) {
              project.author.username = res.data.author.username;
              this.favoriteProjects.push(project);
            }
          });
        });
        this.loadingStatus++;
        isLoading();
      });
      Http.request({
        method: "GET",
        url: `https://itchy-api.vercel.app/api/user?user=${this.username}`,
      }).then((res) => {
        this.loadingStatus++;
        isLoading();
        user = res.data;
        this.bio.about = user.profile.bio;
        this.bio.wiwo = user.profile.status;
        this.projectCount = user.projectCount;
        let fake = document.createElement("img");
        fake.src = `https://cdn2.scratch.mit.edu/get_image/user/${user.id}_500x500.png`;
        Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.username}/projects`,
        }).then((res) => {
          this.userProjects = res.data;
          this.loadingStatus++;
          isLoading();
        });
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
          this.loadingStatus++;
          isLoading();
          /*});
          })*/
        };
        this.joinDate = utils.formatDate(user.history.joined);
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
        this.loadingStatus++;
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
    async openInBrowser() {
      this.opening = true;
      await Browser.open({
        url: `https://scratch.mit.edu/users/${this.username}`,
        toolbarColor: "#4E97FF",
      });
      Browser.addListener("browserFinished", () => {
        this.opening = false;
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

::v-deep(ion-card.featured-project) {
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
  color: white;
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
  margin-bottom: 5px;
  font-size: 0.8em;
  opacity: 0.7;
}

.under-pfp ion-icon {
  transform: translateY(2px);
}

.followers-space {
  padding-left: 12px;
}

p {
  margin: 0;
}

.backbutton {
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  color: white;
}

.backbutton ion-back-button {
  float: left;
  padding: 3px;
}

.backbutton h2 {
  margin-top: 0.6em;
  font-size: 1.3em;
}

.fade-enter-active {
  transition: all 0.2s ease-out;
}

.fade-leave-active {
  transition: all 0.05s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20%);
}

.opacity-enter-active,
.opacity-leave-active {
  transition: opacity 0.2s ease-out;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}

h1 {
  margin-top: 0;
  margin-bottom: 0.1em;
}

ion-progress-bar {
  z-index: 1;
}

ion-card.text-box {
  z-index: -1;
  max-height: 18vh;
  transition: max-height 0.3s ease-out;
  margin-bottom: 0.5em;
  width: 98%;
  margin-left: 4px;
}

.sidescroll {
  width: 100vw;
  margin-left: -16px;
  padding: 0 16px;
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

.text-box:last-of-type {
  margin-bottom: 1.5em;
}

h3 {
  margin-left: 10px;
}

.project-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  margin: 10px;
}
</style>
