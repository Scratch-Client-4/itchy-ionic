

<template>
<ion-app>
  <ion-router-outlet :class="{ dark: darkModeEnabled }" />
</ion-app>
</template>

<script>
// const api = require('./requests.js');
import {
  Plugins
} from '@capacitor/core';
const {
  DarkMode
} = Plugins;
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
      darkModeEnabled: JSON.parse(window.localStorage.getItem("preferences")) ? JSON.parse(window.localStorage.getItem("preferences")).forceDark : false
    }
  },
  created() {
    DarkMode.addListener("darkModeStateChanged", (state) => {
      if (state.isDarkModeOn) {
        this.darkModeEnabled = true;
      } else {
        this.darkModeEnabled = false;
      }
    });
  }
});
</script>
