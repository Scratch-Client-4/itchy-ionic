<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Front Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-refresher slot="fixed" @ionRefresh="refreshData($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
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
const axios = require('axios');
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
    ProjectCard
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
      loaded: [], // holds what requests were done
      requestCount: 4 // how many requests are required to fully load the page
    }
  },
  mounted() {
    console.log(utils.matchRegexes('https://scratch.mit.edu/users/MicahLT/projects'))
    let params = utils.getParams(window.location.href);
    if (params.project) {
      this.openProject(params.project)
    } else if (params.studio) {
      this.presentAlert('Under construction', '', "Studios have not yet been implemented.  We're working on it!");
    } else if (params.user) {
      this.openUser(params.user);
    }
    this.refreshData();
  },
  methods: {
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
      this.loaded = [];
      axios.get('https://itchy-api.vercel.app/api/frontpage?page=featured')
        .then((response) => {
          this.featuredProjects = response.data;
          this.onRequestComplete("featuredProjects", event);
        })

      axios.get('https://itchy-api.vercel.app/api/frontpage?page=toploved')
        .then((response) => {
          this.lovedProjects = response.data;
          this.onRequestComplete("lovedProjects", event);
        })

      axios.get('https://itchy-api.vercel.app/api/frontpage?page=topremixed')
        .then((response) => {
          this.remixedProjects = response.data;
          this.onRequestComplete("remixedProjects", event);
        })

      axios.get('https://itchy-api.vercel.app/api/frontpage?page=curated')
        .then((response) => {
          this.curatedProjects = response.data;
          this.onRequestComplete("curatedProjects", event);
        })
    },
    onRequestComplete(requestName, event) {
      this.loaded.push(requestName);
      // loaded everything?
      if (this.loaded.length >= this.requestCount) {
        if (event) {
          event.target.complete()
        }
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
  color: white;
  transform: translateY(4px);
  padding-right: 10px;
}
</style>
