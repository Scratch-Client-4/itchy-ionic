import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router';
import {
  SplashScreen
} from '@capacitor/splash-screen';

import {
  IonicVue
} from '@ionic/vue';

import i18next from "i18next";
import i18NextVue from "i18next-vue";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/custom.css';
import VueSafeHTML from 'vue-safe-html';

// https://www.i18next.com/how-to/add-or-load-translations
// https://dev.to/adrai/how-to-properly-internationalize-a-vue-application-using-i18next-1doj
i18next
.use(Backend)
.use(LanguageDetector)
.init({
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  fallbackLng: "en",
  // keep these in alphebatical order
  ns: ["account", "activity", "comments", "common", "explore", "messages", "navigation",
  "projects", "search", "settings", "studios", "users"],
  derfaultNS: "common"
})

// https://github.com/i18next/i18next-vue#readme
const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(VueSafeHTML)
  .use(i18NextVue, { i18next });

router.isReady().then(() => {
  app.mount('#app');
  SplashScreen.hide();
});