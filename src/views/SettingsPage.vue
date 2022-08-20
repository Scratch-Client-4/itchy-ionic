<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-title class="ion-padding">{{$t("navigation:settingsPage")}}</ion-title>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{{$t("settings:accountSection")}}</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label v-if="user.signedIn">
            {{$t("account:signedInAs", {username: user.username})}}
          </ion-label>
          <ion-label v-else>{{$t("account:signedOut")}}</ion-label>
          <ion-button v-if="user.signedIn" @click="signOut"
            >{{$t("account:signOut")}}</ion-button>
          <ion-button v-else @click="openAuthWindow">{{$t("account:signIn")}}</ion-button>
        </ion-item>
        <ion-item
          class="ion-activatable"
          v-if="user.signedIn"
          @click="openUserProfile"
        >
          <ion-label>{{$t("account:openYourProfile")}}</ion-label>
          <ion-ripple-effect></ion-ripple-effect>
        </ion-item>
        <ion-item-divider>
          <ion-label>{{$t("settings:interfaceSection")}}</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label>{{$t("settings:themeSelect")}}</ion-label>
          <a class="dropdown" @click="openDarkModePicker"
            >{{ prefs.theme }} <ion-icon :icon="caretDown"
          /></a>
        </ion-item>
        <ion-item>
          <ion-label>{{$t("settings:hapticsToggle")}}</ion-label>
          <ion-toggle
            :checked="prefs.haptics"
            @ionChange="toggle('haptics')"
          ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>{{$t("settings:feedToggle")}}</ion-label>
          <ion-toggle
            :checked="prefs.enableFeed"
            @ionChange="toggle('enableFeed')"
          ></ion-toggle>
        </ion-item>
        <ion-item-divider>
          <ion-label>{{$t("settings:aboutSection")}}</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label>{{$t("common:appVersionString", {version: version})}}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <a href="https://itchy.micahlindley.com/privacy.html"
              >{{$t("settings:privacyPolicyLink")}}</a
            >
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label v-html="$t('settings:credits')">
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
  IonRippleEffect,
  IonIcon,
  modalController,
  popoverController,
} from "@ionic/vue";
import { getPrefs } from "../utils.js";
import { caretDown } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import AuthModal from "../components/AuthModal.vue";
import UserModal from "../components/UserModal.vue";
import DarkModeToggle from "../components/DarkModeToggle.vue";
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
    IonRippleEffect,
    IonIcon,
  },
  data() {
    return {
      version: "0.9.10",
      caretDown,
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
    let prefs = getPrefs();
    return {
      prefs,
      user,
    };
  },
  methods: {
    async openDarkModePicker(e) {
      const popover = await popoverController.create({
        component: DarkModeToggle,
        cssClass: "dropdown-popover",
        event: e,
        translucent: false,
      });
      await popover.present();
      const { data: theme } = await popover.onDidDismiss();
      this.prefs.theme = theme || this.prefs.theme;
      window.localStorage.setItem("preferences", JSON.stringify(this.prefs));
      window.location.reload();
    },
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
    async signOut() {
      window.localStorage.removeItem("session");
      await Storage.clear();
      window.location.reload();
    },
    toggle(setting) {
      this.prefs[setting] = !this.prefs[setting];
      window.localStorage.setItem("preferences", JSON.stringify(this.prefs));
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.dropdown {
  color: inherit;
  opacity: 0.7;
  text-transform: capitalize;
}
.dropdown ion-icon {
  transform: translateY(2px);
  margin-left: 0.25rem;
  margin-right: 5px;
}
</style>