<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Messages</ion-title>
      </ion-toolbar>
    </ion-header>
    <MessagePage />
  </ion-content>
</ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue';
import MessagePage from '@/components/MessagePage.vue';
export default {
  name: 'Tab3',
  components: {
    MessagePage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  }
}
</script>
