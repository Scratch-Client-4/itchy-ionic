<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="explore" @click="closeModal"></ion-back-button>
        <ion-title>{{ username }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
    <div class="user-header" :style="{background: backgroundColor}">
      <img :src="pfp" class="pfp"><br>
      <ion-text class="under-pfp" v-if="!loading" :style="{color: textColor}">Joined {{ joinDate }} • {{ followers }} followers</ion-text>
      <p><br></p>
    </div>
    <ion-card class="top-shift text-box ion-padding">
      <ion-card-content>
        <ion-card-title>Activity</ion-card-title>
        <div v-for="a in activity" :key="a">
          {{ a.user }} {{ a.action }} <a :href="a.target.link">{{ a.target.title }}</a>
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="bio.about.length > 0">
      <ion-card-content>
        <ion-card-title>About Me</ion-card-title>
        <div v-safe-html="bio.about"></div>
      </ion-card-content>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="bio.wiwo.length > 0">
      <ion-card-content>
        <ion-card-title>What I'm Working On</ion-card-title>
        <div v-safe-html="bio.wiwo"></div>
      </ion-card-content>
    </ion-card>
  </ion-content>
</ion-page>
</template>

<script>
// const utils = require('../utils.js');
import {
  parse
} from 'node-html-parser';
import * as Vibrant from 'node-vibrant';
import '@capacitor-community/http';
import {
  Plugins
} from '@capacitor/core';
const {
  Http
} = Plugins;
import {
  IonProgressBar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  modalController,
  IonCard,
  IonCardContent
} from '@ionic/vue';
import {
  defineComponent
} from 'vue'
export default defineComponent({
  name: 'UserModal',
  props: {
    username: {
      type: String,
      default: 'loading...'
    },
    id: Number
  },
  data() {
    return {
      joinDate: '',
      followers: '',
      backgroundColor: '#303c54',
      textColor: 'white',
      loading: true,
      activity: [],
      bio: {
        wiwo: '',
        about: ''
      },
      pfp: './assets/avatar.png'
    }
  },
  components: {
    IonProgressBar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    async loadUser() {
      let userStats, userActivity = {},
        loadingStatus = 0;
      const isLoading = () => {
        console.log(loadingStatus);
        if (loadingStatus > 2) {
          this.loading = false;
          return false;
        } else {
          return true;
        }
      }
      Http.request({
        method: 'GET',
        url: `https://scratchdb.lefty.one/v2/user/info/${this.username}`
      }).then((res) => {
        loadingStatus++;
        isLoading();
        userStats = res.data;
        this.pfp = `https://cdn2.scratch.mit.edu/get_image/user/${userStats.id}_200x200.png`;
        let v = new Vibrant(this.pfp);
        this.joinDate = userStats.joined.slice(0, 10);
        this.followers = userStats.statistics.followers;
        v.getPalette((err, palette) => {
          console.log(palette)
          this.backgroundColor = palette.DarkMuted.hex;
          this.textColor = palette.LightVibrant.hex;
          this.bio.wiwo = userStats.work;
          this.bio.about = userStats.bio;
          loadingStatus++;
          isLoading();
        });
      });
      Http.request({
        method: 'GET',
        url: `https://scratch.mit.edu/messages/ajax/user-activity/?user=${this.username}&max=6`
      }).then((res) => {
        console.log(userActivity)
        loadingStatus++;
        isLoading();
        let unparsed = res.data;
        unparsed = parse(unparsed);
        unparsed = unparsed.querySelectorAll('li');
        for (let i = 1; i <= unparsed.length; i += 2) {
          let obj = {}
          const selected = unparsed[i].querySelector('div');
          obj.user = selected.childNodes[1].innerText;
          obj.action = selected.childNodes[2].innerText.replace(/\s+/g, ' ').trim();
          obj.target = {
            "title": selected.childNodes[3].innerText,
            "link": `https://scratch.mit.edu${selected.childNodes[3].getAttribute('href')}`
          };
          this.activity.push(obj);
        }
        console.log(this.activity);
      });

    }
  }
});
</script>
<style scoped>
.top-shift {
  margin-top: 40px;
}

ion-title {
  margin: auto;
  padding-right: 75px;
  text-align: center;
}

ion-progress-bar {
  transform: translateX(-16px);
}

ion-card-title {
  font-size: 2.5em;
}

.user-header {
  height: max-content;
  width: calc(100% + 2 * 16px);
  margin: calc(0px - 16px);
  text-align: center;
}

.user-header .pfp {
  margin: 10px;
  margin-top: 17px;
  background: white;
  height: 90px;
  width: 90px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.under-pfp {
  margin-bottom: 10px;
  font-size: 0.8em;
}

p {
  margin: 0;
}
</style>
