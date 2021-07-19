<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Messages</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-refresher slot="fixed" @ionRefresh="getMessages(0, $event, true)">
      <ion-refresher-content pulling-text="refresh messages" refreshing-text="refreshing messages..."></ion-refresher-content>
    </ion-refresher>
    <MessagesSignIn v-if="!session" />
    <div v-else>
      <ion-item-group>
        <ion-item button v-for="m in messages" :key="m.id" :href="getLinkFromObj(m)">
          <ion-avatar class="msg-avatar">
            <img :src="getPfpFromObj(m)">
          </ion-avatar>
          <ion-label>
            <h2 v-if="m.type == 'studioactivity'">{{ m.title }}</h2>
            <h2 v-else>{{ m.actor_username }}</h2>
            <ion-note v-if="m.type == 'addcomment'">
              <ion-icon :icon="chatbubbleEllipses" class="blue"></ion-icon> {{ m.comment_fragment }}
            </ion-note>
            <ion-note v-if="m.type == 'followuser'">
              <ion-icon :icon="personAdd" class="blue"></ion-icon> followed you
            </ion-note>
            <ion-note v-if="m.type == 'loveproject'">
              <ion-icon :icon="heart" class="red"></ion-icon> loved {{ m.title }}
            </ion-note>
            <ion-note v-if="m.type == 'favoriteproject'">
              <ion-icon :icon="star" class="yellow"></ion-icon> favorited {{ m.project_title }}
            </ion-note>
            <ion-note v-if="m.type == 'studioactivity'">
              <ion-icon :icon="images" class="blue"></ion-icon> new activity in studio
            </ion-note>
          </ion-label>
        </ion-item>
      </ion-item-group>
      <ion-infinite-scroll @ionInfinite="getMessages(currentOffset, $event, false)" threshold="100px" id="infinite-scroll">
        <ion-infinite-scroll-content class="ion-padding" loading-spinner="circular" loading-text="Loading more messages...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </div>
  </ion-content>
</ion-page>
</template>

<script>
import '@capacitor-community/http';
import {
  Plugins
} from '@capacitor/core';
const {
  Http
} = Plugins;
const utils = require('../utils.js');
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItemGroup,
  IonItem,
  IonLabel,
  IonNote,
  IonAvatar,
  IonRefresher,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';
import {
  chatbubbleEllipses,
  personAdd,
  heart,
  star,
  images
} from 'ionicons/icons';
import MessagesSignIn from '@/components/MessagesSignIn.vue';
export default {
  name: 'MessagesPage',
  components: {
    MessagesSignIn,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItemGroup,
    IonItem,
    IonLabel,
    IonNote,
    IonAvatar,
    IonRefresher,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  data() {
    return {
      session: JSON.parse(window.localStorage.getItem('session')) ? JSON.parse(window.localStorage.getItem('session'))[0] : null,
      messages: [],
      chatbubbleEllipses,
      personAdd,
      heart,
      star,
      images,
      currentOffset: 0
    }
  },
  created() {
    if (this.session) {
      this.getMessages();
    }
  },
  methods: {
    getLinkFromObj(o) {
      if (o.type == 'addcomment') {
        if (o.comment_type == 0) {
          return `https://scratch.mit.edu/projects/${o.comment_obj_id}/#comments-${o.comment_id}`
        } else if (o.comment_type == 1) {
          return `https://scratch.mit.edu/users/${o.comment_obj_title}/#comments-${o.comment_id}`
        } else if (o.comment_type == 2) {
          return `https://scratch.mit.edu/studios/${o.comment_obj_id}/comments/#comments-${o.comment_id}`
        }
      } else if (o.type == 'followuser') {
        return `https://scratch.mit.edu/users/${o.actor_username}`
      } else if (o.type == 'favoriteproject' || o.type == 'loveproject') {
        return `https://scratch.mit.edu/projects/${o.project_id}`
      } else if (o.type == 'studioactivity') {
        return `https://scratch.mit.edu/studios/${o.gallery_id}`
      }
    },
    getPfpFromObj(o) {
      if (o.type == "studioactivity") {
        return `https://uploads.scratch.mit.edu/galleries/thumbnails/${o.gallery_id}.png`
      } else {
        return `https://uploads.scratch.mit.edu/users/avatars/${o.actor_id}.png`;
      }
    },
    async getMessages(offset, event, reset) {
      if (reset) {
        this.noMoreMessages = false;
        this.currentOffset = 0;
      }
      if (this.noMoreMessages) {
        return 0;
      }
      if (this.session) {
        const response = await Http.request({
          method: 'GET',
          url: `https://api.scratch.mit.edu/users/${this.session.username}/messages?offset=${offset || 0}`,
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "origin": "https://scratch.mit.edu/",
            "referer": `https://scratch.mit.edu/`,
            "x-token": this.session.token
          }
        });
        let messages = await response.data;
        console.log(messages);
        if (reset) {
          this.messages = [];
        }
        messages.forEach((m) => {
          if (m.comment_fragment) {
            //eslint-disable-next-line
            let str = m.comment_fragment.replace(/&quot;/g, '\"');
            m.comment_fragment = utils.decodeEntities(str);
          }
          if (m.title) {
            //eslint-disable-next-line
            let str = m.title.replace(/&quot;/g, '\"');
            m.title = utils.decodeEntities(str);
          }
          this.messages.push(m);
        });
        messages = this.htmlDecode(JSON.stringify(messages));
        messages = JSON.parse(messages);
        if (response.status == 200) {
          console.log(messages);
          this.currentOffset += this.messages.length;
          if (messages.length < 20) {
            this.noMoreMessages = true;
          }
          if (event) {
            event.target.complete();
          } else {
            this.loading = false;
          }
        } else {
          this.presentAlert('Error', response.status, 'OK');
        }
      } else {
        if (event) {
          event.target.complete();
        } else {
          this.loading = false;
        }
      }
    },
    htmlDecode(input) {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    }
  }
}
</script>
<style>
ion-icon.blue {
  color: #4D97FF;
}

ion-icon.red {
  color: #FF6680;
}

ion-icon.yellow {
  color: #FFBF00;
}
</style>
