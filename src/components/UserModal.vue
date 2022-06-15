<template>
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
    <Error :code="error.code" :message="error.message" v-if="error.show" />
    <div v-if="!error.show">
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
      <div class="scroller" @scroll="paginate($event)">
        <ProjectCard
          class="featured-project"
          :title="featuredProject.title"
          :author="featuredProject.author"
          :thumb="featuredProject.thumbnail"
          :id="featuredProject.id"
        />
        <UserFeed
          :username="username"
          @openProject="openProject"
          @openUser="openUser"
          :open="userFeedOpen"
          @expand="handleExpandFeed($event)"
        />
        <div class="about">
          <ion-card class="text-box ion-padding" v-if="bio.about.length > 0">
            <ion-card-content>
              <ion-card-title>About Me</ion-card-title>
              <div v-safe-html="bio.about"></div>
            </ion-card-content>
          </ion-card>
          <ion-card class="text-box ion-padding" v-if="bio.wiwo.length > 0">
            <ion-card-content>
              <ion-card-title>What I'm Working On</ion-card-title>
              <div v-safe-html="bio.wiwo"></div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
      <div class="paginator">
        <span :class="['page', { active: page == 0 }]"></span>
        <span :class="['page', { active: page == 1 }]"></span>
        <span :class="['page', { active: page == 2 }]"></span>
      </div>
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
    </div>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="caretUp" />
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button @click="openInBrowser">
          <ion-icon :icon="exit" />
        </ion-fab-button>
        <ion-fab-button @click="openComments">
          <ion-icon :icon="chatbubble" />
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-content>
</template>

<script>
const utils = require("../utils.js");
import ProjectCard from "@/components/ProjectCard.vue";
import UserComments from "@/components/UserComments.vue";
import UserFeed from "@/components/UserFeed.vue";
import Error from "./Error.vue";
//import * as Vibrant from 'node-vibrant';
import { Http } from "@capacitor-community/http";
// import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { Browser } from "@capacitor/browser";
import { useRouter } from "vue-router";
import {
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
import { exit, caretUp, personAdd, calendar, chatbubble } from "ionicons/icons";
import { defineComponent } from "vue";
import ProjectModal from "../components/ProjectModal.vue";
import UserModal from "../components/UserModal.vue";
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
      featuredProject: {},
      showHeader: false,
      headerColor: "transparent",
      opening: false,
      projectCount: "loading",
      userProjects: [],
      favoriteProjects: [],
      exit,
      personAdd,
      calendar,
      caretUp,
      chatbubble,
      page: 0,
      error: {
        show: false,
        code: 200,
        message: "",
      },
      userFeedOpen: false,
    };
  },
  components: {
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
    Error,
    UserFeed,
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
    /*
    App.addListener("backButton", () => {
      setTimeout(() => {
        if (!this.userFeedOpen) {
          alert("CLOSING MODAL!");
          this.closeModal();
        } else {
          alert("MODAL IS NOT NEEDED TO CLOSE");
          this.userFeedOpen = false;
        }
      }, 2000);
    }); */
    this.loadUser();
  },
  methods: {
    handleExpandFeed() {
      this.userFeedOpen = !this.userFeedOpen;
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
    paginate(e) {
      if (e.target.scrollLeft > e.target.offsetWidth * 2 - 100) {
        this.page = 2;
      } else if (e.target.scrollLeft > e.target.offsetWidth - 100) {
        this.page = 1;
      } else {
        this.page = 0;
      }
    },
    async openProject(id) {
      const modal = await modalController.create({
        component: ProjectModal,
        cssClass: "open-modal",
        componentProps: {
          embed: `https://turbowarp.org/${id}/embed`,
          id: id,
        },
      });
      return modal.present();
    },
    async openUser(name) {
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username: name,
        },
      });
      return modal.present();
    },
    async loadUser() {
      let user;
      this.loadingStatus = 0;
      const isLoading = () => {
        if (this.loadingStatus == 5) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          return false;
        } else {
          return true;
        }
      };
      const handleError = (status) => {
        this.error.code = status;
        if (status == 404) {
          this.error.message =
            "We couldn't find this project.\nMaybe it's not shared?";
          this.loadingStatus = 6;
          this.title = "Error";
          this.error.show = true;
        } else if (status == 500) {
          this.error.message = "Scratch's servers are having trouble.";
          this.loadingStatus = 6;
          this.title = "Error";
          this.error.show = true;
        }
        isLoading();
      };
      Http.request({
        method: "GET",
        url: `https://scratch.mit.edu/site-api/users/all/${this.username}`,
      }).then((res) => {
        handleError(res.status);
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
        handleError(res.status);
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
        handleError(res.status);
        this.loadingStatus++;
        isLoading();
        user = res.data;
        this.bio.about = user.profile.bio;
        this.bio.wiwo = user.profile.status;
        this.projectCount = utils.formatNumber(user.projectCount);
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
          this.followers = utils.formatNumber(user.followers);
        } else {
          this.followers = "dontshow";
        }
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
    async openComments() {
      const modal = await modalController.create({
        component: UserComments,
        cssClass: "open-modal",
        componentProps: {
          type: "user",
          title: this.username,
        },
      });
      return modal.present();
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
  z-index: 2;
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
  z-index: 1;
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

::v-deep(ion-card.featured-project) {
  width: 93.5%;
  margin: auto;
  margin-left: 10%;
  margin-right: 16px;
  margin-bottom: 0.5em;
  max-height: 100% !important;
  display: inline-block;
  flex: 0 0 auto;
  scroll-snap-align: center;
}

.scroller {
  display: flex;
  overflow-x: auto;
  flex-wrap: nowrap;
  width: 100%;
  margin-left: -16px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.paginator {
  margin: auto;
  width: max-content;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3em 0.4em;
  user-select: none;
  height: 1em;
  line-height: 0.5rem;
  border-radius: 0.6em;
}

.page:nth-of-type(1):after,
.page:nth-of-type(2):after {
  margin-right: 0.1em;
}
.page:after {
  content: "•";
  color: white;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.page.active:after {
  opacity: 1;
}

.about {
  scroll-snap-align: center;
  width: 93.5%;
  flex: 0 0 auto;
  margin: auto;
  margin-right: 10%;
  margin-top: 0;
}

.about ion-card {
  margin: auto;
  margin-bottom: 0.5em;
}

@media only screen and (max-width: 768px) {
  .scroller {
    width: calc(100% + 32px);
  }
}
</style>
