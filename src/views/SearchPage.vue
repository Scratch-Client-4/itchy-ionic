<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Search</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-searchbar id="search" animated="true" autocorrect="on" enterkeyhint="search" inputmode="search" spellcheck="true" @search="search($event, $event.target.value, 0)"></ion-searchbar>
    <div id="container" v-if="searchData.length < 1">
      <span>
        <ion-icon :icon="constructOutline"></ion-icon>
      </span>
      <p>Itchy's built-in custom search is still in beta, so you may experience some issues!</p>
    </div>
    <ion-item-group v-if="searchData.length > 0">
      <ion-item class="ion-activatable" v-for="(result, i) in searchData" :key="i" @click="openResult(result)">
        <ion-avatar class="msg-avatar">
          <img :src="result.image">
        </ion-avatar>
        <ion-label>
          <h2>{{ result.title }}</h2>
          <ion-note>
            {{ result.type }}
          </ion-note>
        </ion-label>
        <ion-ripple-effect></ion-ripple-effect>
      </ion-item>
    </ion-item-group>
    <ion-infinite-scroll @ionInfinite="search($event, searchString, currentOffset)" threshold="100px" id="infinite-scroll">
      <ion-infinite-scroll-content class="ion-padding" loading-spinner="circular" loading-text="Loading more results...">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </ion-content>
</ion-page>
</template>

<script>
const utils = require('../utils.js');
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonItemGroup,
  IonAvatar,
  IonLabel,
  IonNote,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRippleEffect,
  alertController
} from '@ionic/vue';
import {
  useRouter
} from 'vue-router';
import {
  constructOutline
} from 'ionicons/icons';
import {
  Browser
} from '@capacitor/browser';
export default {
  name: 'SearchPage',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSearchbar,
    IonItem,
    IonItemGroup,
    IonAvatar,
    IonLabel,
    IonNote,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRippleEffect
  },
  data() {
    const router = useRouter();
    return {
      searchData: [],
      currentOffset: 0,
      searchString: "",
      completedSearch: false,
      constructOutline,
      router
    }
  },
  methods: {
    async presentAlert(title, code, message) {
      const alert = await alertController
        .create({
          header: title,
          subHeader: code,
          message: message,
          buttons: ['OK']
        });
      return alert.present();
    },
    async search(event, query, offset) {
      if (offset == 0) {
        this.currentOffset = 0;
        this.searchData = [];
      }
      if (this.completedSearch) {
        return 0;
      }
      this.searchString = query;
      const toPush = await utils.unifiedSearch(query, offset);
      this.searchData = this.searchData.concat(toPush);
      this.currentOffset += 5;
      event.target.blur();
    },
    async openResult(result) {
      if (result.type == "User profile") {
        this.router.push({
          path: "/tabs/explore",
          query: {
            user: result.title
          }
        })
      } else if (result.type[0] == "P") {
        this.router.push({
          path: "/tabs/explore",
          query: {
            project: result.id
          }
        })
      } else if (result.type == "Studio") {
        await Browser.open({
          url: `https://scratch.mit.edu/studios/${result.id}`,
          toolbarColor: "#4E97FF"
        })
      }
    }
  }
}
</script>
<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container span {
  font-size: 40px;
  line-height: 26px;
  --ionicon-stroke-width: 20px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
  padding: 0.5em 2em;
}
</style>
