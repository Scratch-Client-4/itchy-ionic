<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <DevNotice name="Settings" />
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
import DevNotice from '@/components/DevNotice.vue';

export default {
  name: 'Tab4',
  components: {
    DevNotice,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  }
}
</script>
