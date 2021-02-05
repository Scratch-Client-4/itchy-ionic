<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-title class="ion-padding">Settings</ion-title>
    <ion-item-group>
      <ion-item-divider>
        <ion-label>
          Account
        </ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-label v-if="user.signedIn">
          Signed in as {{ user.username }}
        </ion-label>
        <ion-label v-else>
          Signed out
        </ion-label>
        <ion-button v-if="user.signedIn" @click="signOut">Sign Out</ion-button>
        <ion-button v-else @click="openAuthWindow">Sign In</ion-button>
      </ion-item>
      <ion-item-divider>
        <ion-label>
          Display
        </ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-label>
          Force dark theme
        </ion-label>
        <ion-toggle :checked="prefs.forceDark" @ionChange="toggleDarkMode"></ion-toggle>
      </ion-item>
      <ion-item-divider>
        <ion-label>
          About
        </ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-label>
          Itchy v0.0.2
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          Made <a href="https://github.com/scratch-client-4/itchy-ionic">open source</a> with 💖
        </ion-label>
      </ion-item>
    </ion-item-group>
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
  IonItem,
  IonItemGroup,
  IonLabel,
  IonItemDivider,
  IonButton,
  modalController
} from '@ionic/vue';
import AuthModal from '../components/AuthModal.vue';
export default {
  name: 'Tab4',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonItemDivider,
    IonButton
  },
  data() {
    return {}
  },
  setup() {
    let user = JSON.parse(window.localStorage.getItem("session"));
    if (window.localStorage.getItem("session")) {
      user = user[0];
      user.signedIn = true;
    } else {
      user = {
        "signedIn": false
      }
    }
    let prefs;
    if (!window.localStorage.getItem("preferences")) {
      prefs = {
        "forceDark": false
      }
      window.localStorage.setItem("preferences", JSON.stringify(prefs));
    } else {
      prefs = JSON.parse(window.localStorage.getItem("preferences"));
    }
    return {
      prefs,
      user
    }
  },
  methods: {
    async openAuthWindow() {
      const modal = await modalController
        .create({
          component: AuthModal,
          cssClass: 'open-modal',
          componentProps: {
            mode: 'Login'
          }
        })
      return modal.present();
    },
    signOut() {
      window.localStorage.removeItem("session");
      window.location.reload();
    },
    toggleDarkMode() {
      this.prefs.forceDark = !this.prefs.forceDark;
      window.localStorage.setItem("preferences", JSON.stringify(this.prefs));
    }
  }
}
</script>
