<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Front Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-refresher slot="fixed" @ionRefresh="refreshData($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <!-- FEATURED PROJECTS -->
    <ion-text v-if="!loading">
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
    <ion-text v-if="!loading">
      <h2>Curated</h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in curatedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
    <!-- TOP REMIXED PROJECTS -->
    <ion-text v-if="!loading">
      <h2>Top Remixed</h2>
    </ion-text>
    <div class="sidescroll">
      <div v-for="project in remixedProjects" :key="project.thumbnail_url">
        <ProjectCard :title="project.title" :author="project.creator" :thumb="project.thumbnail_url" :id="project.id" :instructions="project.instructions" :credits="project.description"></ProjectCard>
      </div>
    </div>
  </ion-content>
  <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
</ion-page>
</template>

<script>
const axios = require('axios');
const utils = require('../utils.js');
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonRefresher,
  modalController,
  alertController
} from '@ionic/vue';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectModal from '../components/ProjectModal.vue';
export default {
  name: 'Tab1',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonText,
    IonRefresher,
    ProjectCard
  },
  data() {
    return {
      featuredProjects: [],
      lovedProjects: [],
      curatedProjects: [],
      remixedProjects: [],
      loading: true
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
    refreshData(event) {
      axios
        .get('https://itchy-api.vercel.app/api/frontpage?page=featured')
        .then((response) => {
          this.featuredProjects = response.data;
          console.log(response.data)
          axios
            .get('https://itchy-api.vercel.app/api/frontpage?page=toploved')
            .then((response) => {
              this.lovedProjects = response.data;
              axios
                .get('https://itchy-api.vercel.app/api/frontpage?page=topremixed')
                .then((response) => {
                  this.remixedProjects = response.data;
                  axios
                    .get('https://itchy-api.vercel.app/api/frontpage?page=curated')
                    .then((response) => {
                      this.curatedProjects = response.data;
                      if (event) {
                        event.target.complete();
                      } else {
                        this.loading = false;
                      }
                    })
                })
            })
        })
    }
  }
}
</script>
