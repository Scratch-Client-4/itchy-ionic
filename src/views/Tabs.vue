<template>
<ion-page>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1" href="/tabs/explore">
        <ion-icon :icon="earthOutline" />
        <ion-label>Explore</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab2" href="/tabs/search">
        <ion-icon :icon="search" />
        <ion-label>Search</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab3" href="/tabs/messages" @click="openMessages">
        <ion-icon :icon="mailOutline" />
        <ion-label>Messages</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab4" href="/tabs/settings">
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
      const session = window.localStorage.getItem('session');
      if (!session) {
        window.open('https://scratch.mit.edu/messages');
      }
    }
  }
}
</script>
