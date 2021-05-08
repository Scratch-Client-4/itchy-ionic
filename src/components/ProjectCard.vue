<template>
<ion-card class="ion-activatable ripple-parent" @click="openProject">
  <img :src="thumb" alt="ion">
  <ion-card-header>
    <ion-card-title>{{ title }}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    by <a @click="openAuthor($event)">{{ author }}</a>
  </ion-card-content>
  <ion-ripple-effect></ion-ripple-effect>
</ion-card>
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonRippleEffect,
  modalController
} from '@ionic/vue';
import {
  defineComponent
} from 'vue';
import ProjectModal from './ProjectModal.vue';
import UserModal from './UserModal.vue';
export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonRippleEffect
  },
  setup() {},
  props: {
    title: String,
    author: String,
    thumb: String,
    id: Number
  },
  methods: {
    async openProject() {
      console.log(this.instructions);
      const modal = await modalController
        .create({
          component: ProjectModal,
          cssClass: 'open-modal',
          componentProps: {
            title: this.title,
            embed: `https://turbowarp.org/${this.id}/embed`,
            id: this.id,
            author: this.author
          },
        })
      return modal.present();
    },
    async openAuthor(event) {
      event.stopPropagation();
      const modal = await modalController
        .create({
          component: UserModal,
          cssClass: 'open-modal',
          componentProps: {
            username: this.author
          },
        })
      return modal.present();
    },
  }
});
</script>
