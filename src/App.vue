<template>
  <ion-app>
    <ion-router-outlet
      :class="themeClass"
    />
  </ion-app>
</template>

<script>
const themeClasses = {"light": "light", "dark": "dark"};
const utils = require("./utils.js");
import { isPlatform } from "@ionic/vue";
import {
  IonApp,
  IonRouterOutlet,
  alertController,
  modalController,
} from "@ionic/vue";
import { StatusBar } from "@capacitor/status-bar";
import { Http } from "@capacitor-community/http";
import { LocalNotifications } from "@capacitor/local-notifications";
import UserModal from "@/components/UserModal.vue";
import ProjectModal from "@/components/ProjectModal.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  data() {
    let themeClass, userSignedIn, username;
    if (window.localStorage.getItem("session")) {
      let session = JSON.parse(window.localStorage.getItem("session"));
      username = session.username;
      userSignedIn = true;
    } else {
      userSignedIn = false;
    }
    
    themeClass = this.getThemeClass();
    this.updateTheme(themeClass);

    return {
      themeClass,
      userSignedIn,
      username,
    };
  },
  created() {
    //StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({
      color: "#121212",
    });
    if (isPlatform("android")) {
      try {
        window.plugins.intentShim.onIntent(function (intent) {
          if (intent.data) {
            let uri = utils.matchRegexes(intent.data);
            if (uri.type == "homepage") {
              return 0;
            } else if (uri.type == "project") {
              this.openUser(uri.id);
            }
          }
        });
      } catch {
        console.error(
          "Could not find Android Intent Shim plugin - see https://ionicframework.com/docs/native/web-intent"
        );
      }
      LocalNotifications.requestPermissions().then((state) => {
        if (state.display == "granted" && this.userSignedIn) {
          this.scheduleNotifs();
        }
      });
      LocalNotifications.addListener("localNotificationReceived", (notif) => {
        if (notif.id == 1) {
          Http.request({
            method: "GET",
            url: `https://api.scratch.mit.edu/users/${this.username}/messages/count`,
          }).then((response) => {
            if (response.data.count > 0) {
              LocalNotifications.schedule({
                notifications: [
                  {
                    title: `${response.data.count} unread messages`,
                    body: "You have new messages on Scratch",
                    id: 2,
                    smallIcon: "ic_notif",
                  },
                ],
              });
            }
          });
          LocalNotifications.cancel({
            notifications: [
              {
                id: 1,
              },
            ],
          });
          this.scheduleNotifs();
        }
      });
    } else if (isPlatform("desktop")) {
      this.presentAlert(
        "Unsupported Platform",
        "You're running Itchy on desktop.  Please use Ctrl+Shift+I to open devtools and attempt to emulate a mobile device for the best experience."
      );
    }
  },
  methods: {
    getThemeClass() {
      let prefs = utils.getPrefs();

      if (themeClasses[prefs?.theme]) {
        return themeClasses[prefs?.theme];
      }
      else {
        return "system";
      }
    },
    updateTheme(themeClass) {
      if (!themeClass) {
        themeClass = this.getThemeClass();
      }

      Object.values(themeClasses).forEach((className) => {
        document.documentElement.classList.remove(className);
        document.body.classList.remove(className);
      });

      document.documentElement.classList.add(themeClass);
      document.body.classList.add(themeClass);
      this.themeClass = themeClass;
    },
    async openUser(name) {
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username: name,
        },
      });
      return modal.present();
    },
    async openProject(id) {
      const modal = await modalController.create({
        component: ProjectModal,
        cssClass: "open-modal",
        componentProps: {
          title: "loading...",
          embed: `https://turbowarp.org/${this.id}/embed`,
          id: id,
          author: "loading...",
        },
      });
      return modal.present();
    },
    async scheduleNotifs() {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Fetching messages...",
            id: 1,
            text: "Fetching...",
            schedule: {
              at: new Date(Date.now() + 60000 * 15), // Every fifteen min
              every: "minute",
              allowWhileIdle: true,
            },
            smallIcon: "ic_notif",
          },
        ],
      });
    },
    async presentAlert(title, message) {
      const alert = await alertController.create({
        header: title,
        message: message,
        buttons: ["OK"],
      });
      return alert.present();
    },
  },
});
</script>
