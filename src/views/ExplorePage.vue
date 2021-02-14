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
      <h2>Featured</h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in featuredProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- TOP LOVED PROJECTS -->
    <ion-text>
      <h2>Top Loved</h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in lovedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- CURATED PROJECTS -->
    <ion-text>
      <h2>Curated</h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in curatedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- TOP REMIXED PROJECTS -->
    <ion-text>
      <h2>Top Remixed</h2>
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
  modalController,
  alertController
} from '@ionic/vue';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectModal from '../components/ProjectModal.vue';
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
    ProjectCard
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
    let params = utils.getParams(window.location.href)
    if (params.project) {
      this.openProject(params.project)
    } else if (params.studio) {
      this.presentAlert('Under construction', '', "Studios have not yet been implemented.  We're working on it!");
    }
    this.refreshData();
  },
  methods: {
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
