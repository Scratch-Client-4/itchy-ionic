<template>
<ion-page>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1" href="/tabs/tab1">
        <ion-icon :icon="earthOutline" />
        <ion-label>Explore</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab2" href="/tabs/tab2">
        <ion-icon :icon="search" />
        <ion-label>Search</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab3" href="/tabs/tab3" @click="openMessages">
        <ion-icon :icon="mailOutline" />
        <ion-label>Messages</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab4" href="/tabs/tab4">
        <ion-icon :icon="settingsOutline" />
        <ion-label>Settings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage
} from '@ionic/vue';
import {
  earthOutline,
  search,
  mailOutline,
  settingsOutline
} from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage
  },
  setup() {
    return {
      earthOutline,
      search,
      mailOutline,
      settingsOutline
    }
  },
  methods: {
    openMessages() {
      window.open('https://scratch.mit.edu/messages');
    }
  }
}
</script>
