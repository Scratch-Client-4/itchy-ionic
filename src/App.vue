

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
    return {
      darkModeEnabled: false
    }
  },
  created() {
    /*
    DarkMode.addListener("darkModeStateChanged", (state) => {
      if (state.isDarkModeOn) {
        this.darkModeEnabled = true;
      } else {
        this.darkModeEnabled = false;
      }
    }); */
    if (isPlatform('android')) {
      try {
        window.plugins.intentShim.onIntent(function(intent) {
          let uri = utils.matchRegexes(intent.data);
          if (uri.type == "homepage") {
            return 0;
          } else if (uri.type == "project" || uri.type == "studio" || uri.type == "user") {
            window.location.replace(`/tabs/explore?${uri.type}=${uri.id}`);
          }
        });
      } catch {
        console.error('Could not find Android Intent Shim plugin - see https://ionicframework.com/docs/native/web-intent');
      }
    } else if (isPlatform('desktop')) {
      this.presentAlert('Unsupported Platform', "You're running Itchy on desktop.  Please use Ctrl+Shift+I to open devtools and attempt to emulate a mobile device for the best experience.");
    }
  },
  methods: {
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
