<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Search</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-searchbar></ion-searchbar>
    <DevNotice name="Search" />
  </ion-content>
</ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar
} from '@ionic/vue';
import DevNotice from '@/components/DevNotice.vue';
export default {
  name: 'Tab2',
  components: {
    DevNotice,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSearchbar
  }
}
</script>
