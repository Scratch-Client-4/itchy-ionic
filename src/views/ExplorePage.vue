<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-progress-bar v-if="!loaded" type="indeterminate"></ion-progress-bar>
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Front Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="fade-off"></div>
    <ion-refresher slot="fixed" @ionRefresh="refreshData($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <!-- WHAT'S HAPPENING FEED -->
    <Feed ref="feed" v-if="session && prefs.enableFeed"></Feed>
    <!-- FEATURED PROJECTS -->
    <ion-text>
      <h2>
        <ion-icon :icon="ribbonOutline"></ion-icon>Featured
      </h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in featuredProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- TOP LOVED PROJECTS -->
    <ion-text>
      <h2>
        <ion-icon :icon="heartOutline"></ion-icon>Top Loved
      </h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in lovedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- CURATED PROJECTS -->
    <ion-text>
      <h2>
        <ion-icon :icon="diamondOutline"></ion-icon>Curated
      </h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in curatedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- TOP REMIXED PROJECTS -->
    <ion-text>
      <h2>
        <ion-icon :icon="syncOutline"></ion-icon>Top Remixed
      </h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in remixedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
  </ion-content>
</ion-page>
</template>

<script>
import LongPress from 'vue-directive-long-press';
import '@capacitor-community/http';
import {
  Plugins
} from '@capacitor/core';
const {
  Http
} = Plugins;
const utils = require('../utils.js');
import {
  IonProgressBar,
  IonPage,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonIcon,
  modalController,
  alertController,
  // actionSheetController
} from '@ionic/vue';
import Feed from '../components/Feed.vue';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectModal from '../components/ProjectModal.vue';
import UserModal from '../components/UserModal.vue';
import {
  ribbonOutline,
  heartOutline,
  diamondOutline,
  syncOutline
} from 'ionicons/icons';
export default {
  name: 'ExplorePage',
  components: {
    IonProgressBar,
    IonHeader,
    IonRefresher,
    IonRefresherContent,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonText,
    IonIcon,
    ProjectCard,
    Feed
  },
  directives: {
    'long-press': LongPress
  },
  setup() {
    return {
      ribbonOutline,
      heartOutline,
      diamondOutline,
      syncOutline
    };
  },
  data() {
    return {
      featuredProjects: [],
      lovedProjects: [],
      curatedProjects: [],
      remixedProjects: [],
      loaded: false,
      session: JSON.parse(window.localStorage.getItem('session')) ? JSON.parse(window.localStorage.getItem('session')) : null,
      prefs: JSON.parse(window.localStorage.getItem('preferences')) ? JSON.parse(window.localStorage.getItem('preferences')) : null
    }
  },
  mounted() {
    this.detectParams();
    this.refreshData();
  },
  watch: {
    // call again the method if the route changes
    '$route': 'detectParams'
  },
  methods: {
    detectParams() {
      let params = utils.getParams(window.location.href);
      if (params.project) {
        this.openProject(params.project);
      } else if (params.studio) {
        this.presentAlert('Under construction', '', "Studios have not yet been implemented.  We're working on it!");
      } else if (params.user) {
        this.openUser(params.user);
      }
    },
    onLongPressStart() {
      console.log('long-press')
    },
    onLongPressStop() {
      console.log('long-press-stop')
    },
    async presentAlert(title, code, message) {
      const alert = await alertController
        .create({
          header: title,
          subHeader: code,
          message: message,
          buttons: ['OK']
        });
      return alert.present();
    },
    async openProject(id) {
      const modal = await modalController
        .create({
          component: ProjectModal,
          cssClass: 'open-modal',
          componentProps: {
            title: 'loading...',
            embed: `https://turbowarp.org/${id}/embed`,
            id: id,
            author: 'loading...'
          },
        })
      return modal.present();
    },
    async openUser(name) {
      const modal = await modalController
        .create({
          component: UserModal,
          cssClass: 'open-modal',
          componentProps: {
            username: name
          },
        })
      return modal.present();
    },
    async refreshData(event) {
      this.loaded = false;
      if (window.localStorage.getItem('session')) {
        this.$refs.feed.loadFeed();
      }
      Http.request({
          method: 'GET',
          url: 'https://api.scratch.mit.edu/proxy/featured'
        })
        .then((response) => {
          if (response.status == 200) {
            this.featuredProjects = response.data.community_featured_projects;
            this.lovedProjects = response.data.community_most_loved_projects;
            this.remixedProjects = response.data.community_most_remixed_projects;
            this.curatedProjects = response.data.curator_top_projects;
            this.loaded = true;
          } else {
            this.presentAlert(response.status, '', 'We encountered an error while fetching data.')
          }
        })
      if (event) {
        event.target.complete();
      }
    }
  },
  computed: {
    loading: function() {
      return this.loaded.length < this.requestCount;
    }
  }
}
</script>
<style scoped>
ion-icon {
  color: var(--ion-text-color);
  transform: translateY(4px);
  padding-right: 10px;
}
</style>
