

<template>
<ion-app>
  <ion-router-outlet :class="{ dark: darkModeEnabled }" />
</ion-app>
</template>

<script>
const utils = require('./utils.js');
import {
  IonApp,
  IonRouterOutlet
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
    window.plugins.intentShim.onIntent(function(intent) {
      let uri = utils.matchRegexes(intent.data);
      if (uri.type == "homepage") {
        return 0;
      } else if (uri.type == "project" || uri.type == "studio") {
        window.location.replace(`/tabs/tab1?${uri.type}=${uri.id}`);
      }
    });
  }
});
</script>
