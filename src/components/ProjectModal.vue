<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="tab1" @click="closeModal"></ion-back-button>
        <ion-title>{{ title }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <div class="tw-wrapper">
      <iframe class="tw-player" :src="embed" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>
    </div>
  </ion-content>
</ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  modalController
} from '@ionic/vue';
import {
  defineComponent
} from 'vue'
export default defineComponent({
  name: 'ProjectModal',
  props: {
    title: {
      type: String,
      default: 'Project'
    },
    embed: {
      type: String,
      default: 'https://experiments.turbowarp.org/transparent-embeds/embed.html'
    }
  },
  data() {
    return {
      content: 'Content'
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    }
  }
});
</script>
