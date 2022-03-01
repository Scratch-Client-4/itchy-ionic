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
          <ion-label> Account </ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label v-if="user.signedIn">
            Signed in as {{ user.username }}
          </ion-label>
          <ion-label v-else> Signed out </ion-label>
          <ion-button v-if="user.signedIn" @click="signOut"
            >Sign Out</ion-button
          >
          <ion-button v-else @click="openAuthWindow">Sign In</ion-button>
        </ion-item>
        <ion-item
          class="ion-activatable"
          v-if="user.signedIn"
          @click="openUserProfile"
        >
          <ion-label> Open your profile </ion-label>
          <ion-ripple-effect></ion-ripple-effect>
        </ion-item>
        <ion-item-divider>
          <ion-label> Display </ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label> Force dark theme </ion-label>
          <ion-toggle
            :checked="prefs.forceDark"
            @ionChange="toggle('forceDark')"
          ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label> Enable personal data on Explore </ion-label>
          <ion-toggle
            :checked="prefs.enableFeed"
            @ionChange="toggle('enableFeed')"
          ></ion-toggle>
        </ion-item>
        <ion-item-divider>
          <ion-label> About </ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label> Itchy v{{ version }} </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <a href="https://itchy.micahlindley.com/privacy.html">Privacy Policy</a>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Made
            <a href="https://github.com/scratch-client-4/itchy-ionic"
              >open source</a
            >
            with 💖
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
  IonToggle,
  modalController,
} from "@ionic/vue";
import AuthModal from "../components/AuthModal.vue";
import UserModal from "../components/UserModal.vue";
export default {
  name: "SettingsPage",
  components: {
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
    IonToggle,
  },
  data() {
    return {
      version: "0.9.5",
    };
  },
  setup() {
    let user = JSON.parse(window.localStorage.getItem("session"));
    if (window.localStorage.getItem("session")) {
      user.signedIn = true;
    } else {
      user = {
        signedIn: false,
      };
    }
    let prefs;
    if (!window.localStorage.getItem("preferences")) {
      prefs = {
        forceDark: false,
        enableFeed: true,
      };
      window.localStorage.setItem("preferences", JSON.stringify(prefs));
    } else {
      prefs = JSON.parse(window.localStorage.getItem("preferences"));
    }
    return {
      prefs,
      user,
    };
  },
  methods: {
    async openUserProfile() {
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username: this.user.username,
        },
      });
      return modal.present();
    },
    async openAuthWindow() {
      const modal = await modalController.create({
        component: AuthModal,
        cssClass: "open-modal",
        componentProps: {
          mode: "Login",
        },
      });
      return modal.present();
    },
    signOut() {
      window.localStorage.removeItem("session");
      window.location.reload();
    },
    toggle(setting) {
      this.prefs[setting] = !this.prefs[setting];
      window.localStorage.setItem("preferences", JSON.stringify(this.prefs));
      window.setTimeout(() => {
        window.location.reload();
      }, 150);
    },
  },
};
</script>
