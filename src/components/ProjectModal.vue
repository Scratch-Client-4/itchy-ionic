<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="explore" @click="closeModal"></ion-back-button>
        <ion-title>{{ title }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <div class="tw-wrapper">
      <iframe class="tw-player" :src="embed" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>
    </div>
    <ion-card class="text-box ion-activatable ripple-parent">
      <ion-card-content class="author-box" @click="openAuthor">
        <img :src="pfp" class="author-pfp"><span class="author-name">by {{ author }}</span>
      </ion-card-content>
      <ion-ripple-effect></ion-ripple-effect>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="instructions.length > 1">
      <ion-card-content>
        <ion-card-title>Instructions</ion-card-title>
        <div v-html="instructions">
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="credits.length > 1">
      <ion-card-content>
        <ion-card-title>Credits</ion-card-title>
        <div v-html="credits">
        </div>
      </ion-card-content>
    </ion-card>
    <br />
  </ion-content>
</ion-page>
</template>

<script>
const axios = require('axios');
const utils = require('../utils.js');
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  modalController,
  IonCard,
  IonCardContent,
  IonRippleEffect
} from '@ionic/vue';
import {
  defineComponent
} from 'vue';
import UserModal from './UserModal.vue';
export default defineComponent({
  name: 'ProjectModal',
  props: {
    embed: {
      type: String,
      default: 'https://turbowarp.org/embed.html'
    },
    id: Number
  },
  data() {
    return {
      title: 'loading...',
      author: '',
      content: '',
      instructions: 'loading...',
      credits: '',
      pfp: 'https://u.cubeupload.com/darkness3560/newscratchavataropti.png'
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonRippleEffect
  },
  mounted() {
    this.loadProject();
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    loadProject() {
      axios
        .get(`https://itchy-api.vercel.app/api/project?id=${this.id}`)
        .then((response) => {
          this.instructions = utils.prepareText(response.data.instructions);
          this.credits = utils.prepareText(response.data.description);
          this.pfp = response.data.author.profile.images["90x90"];
          this.title = response.data.title;
          this.author = response.data.author.username;
        })
    },
    async openAuthor() {
      const modal = await modalController
        .create({
          component: UserModal,
          cssClass: 'open-modal',
          componentProps: {
            username: this.author
          },
        })
      this.closeModal();
      return modal.present();
    },
  }
});
</script>
<style scoped>
</style>
