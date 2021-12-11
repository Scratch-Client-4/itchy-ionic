

<template>
<ion-app>
  <ion-router-outlet :class="{ dark: darkModeEnabled }" />
</ion-app>
</template>

<script>
const utils = require('./utils.js');
import {
  isPlatform
} from '@ionic/vue';
import {
  IonApp,
  IonRouterOutlet,
  alertController
}
from '@ionic/vue';
import {
  StatusBar
} from '@capacitor/status-bar';
import '@capacitor-community/http';
import {
  LocalNotifications
} from '@capacitor/local-notifications';
import {
  Plugins
} from '@capacitor/core';
const {
  Http,
} = Plugins;
import {
  defineComponent
}
from 'vue';
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data() {
    let userSignedIn, username, darkForced;
    if (window.localStorage.getItem("session")) {
      let session = JSON.parse(window.localStorage.getItem("session"));
      username = session.username;
      userSignedIn = true;
    } else {
      userSignedIn = false;
    }
    if (window.localStorage.getItem("preferences")) {
      let prefs = JSON.parse(window.localStorage.getItem("preferences"));
      if (prefs.forceDark) {
        darkForced = true;
        document.body.classList.add('dark');
      }
    }
    return {
      darkModeEnabled: darkForced,
      userSignedIn,
      username
    }
  },
  created() {
    //StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({
      color: '#121212'
    });
    if (isPlatform('android')) {
      try {
        window.plugins.intentShim.onIntent(function(intent) {
          if (intent.data) {
            let uri = utils.matchRegexes(intent.data);
            if (uri.type == "homepage") {
              return 0;
            } else if (uri.type == "project" || uri.type == "studio" || uri.type == "user") {
              window.location.replace(`/tabs/explore?${uri.type}=${uri.id}`);
            }
          }
        });
      } catch {
        console.error('Could not find Android Intent Shim plugin - see https://ionicframework.com/docs/native/web-intent');
      }
      LocalNotifications.requestPermissions().then((state) => {
        if (state.display == 'granted' && this.userSignedIn) {
          this.scheduleNotifs();
        }
      });
      LocalNotifications.addListener('localNotificationReceived', (notif) => {
        if (notif.id == 1) {
          Http.request({
            method: "GET",
            url: `https://api.scratch.mit.edu/users/${this.username}/messages/count`
          }).then((response) => {
            if (response.data.count > 0) {
              LocalNotifications.schedule({
                notifications: [{
                  title: `${response.data.count} unread messages`,
                  body: 'You have new messages on Scratch',
                  id: 2,
                  smallIcon: 'ic_notif'
                }]
              });
            }
          });
          LocalNotifications.cancel({
            notifications: [{
              id: 1
            }]
          });
          this.scheduleNotifs();
        }
      });
    } else if (isPlatform('desktop')) {
      this.presentAlert('Unsupported Platform', "You're running Itchy on desktop.  Please use Ctrl+Shift+I to open devtools and attempt to emulate a mobile device for the best experience.");
    }
  },
  methods: {
    async scheduleNotifs() {
      await LocalNotifications.schedule({
        notifications: [{
          title: 'Fetching messages...',
          id: 1,
          text: 'Fetching...',
          schedule: {
            at: new Date(Date.now() + 60000 * 15), // Every fifteen min
            every: 'minute',
            allowWhileIdle: true
          },
          smallIcon: 'ic_notif'
        }]
      });
    },
    async presentAlert(title, message) {
      const alert = await alertController
        .create({
          header: title,
          message: message,
          buttons: ['OK']
        });
      return alert.present();
    }
  }
});
</script>
