<template>
<ion-page>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1" href="/tabs/explore" @click="vibrate">
        <ion-icon :icon="earthOutline" />
        <ion-label>Explore</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab2" href="/tabs/search" @click="vibrate">
        <ion-icon :icon="search" />
        <ion-label>Search</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab3" href="/tabs/messages" @click="vibrate">
        <ion-icon :icon="mailOutline" />
        <ion-label>Messages</ion-label>
        <ion-badge v-if="userSignedIn" color="primary">{{ messageCount }}</ion-badge>
      </ion-tab-button>

      <ion-tab-button tab="tab4" href="/tabs/settings" @click="vibrate">
        <ion-icon :icon="settingsOutline" />
        <ion-label>Settings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</ion-page>
</template>

<script>
import '@capacitor-community/http';
import {
  Haptics,
  ImpactStyle
} from '@capacitor/haptics';
import {
  Plugins
} from '@capacitor/core';
const {
  Http
} = Plugins;
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonBadge
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
    IonPage,
    IonBadge
  },
  setup() {
    let userSignedIn, username;
    if (window.localStorage.getItem("session")) {
      let session = JSON.parse(window.localStorage.getItem("session"));
      username = session.username;
      userSignedIn = true;
    } else {
      userSignedIn = false;
    }
    return {
      earthOutline,
      search,
      mailOutline,
      settingsOutline,
      userSignedIn,
      username
    }
  },
  data() {
    return {
      messageCount: '-'
    }
  },
  created() {
    if (this.userSignedIn) {
      Http.request({
        method: "GET",
        url: `https://api.scratch.mit.edu/users/${this.username}/messages/count`
      }).then((response) => {
        this.messageCount = response.data.count;
      });
    }
  },
  methods: {
    async vibrate() {
      await Haptics.impact({
        style: ImpactStyle.Light
      });
    },
    refreshMessages() {
      window.setInterval(() => {
        Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.username}/messages/count`
        }).then((response) => {
          this.messageCount = response.data.count;
        });
      }, 180000);
    }
  }
}
</script>
