<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Messages</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-refresher slot="fixed" @ionRefresh="getMessages(0, $event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <MessagesPageContent v-if="!session" />
    <ion-item-group>
      <ion-item button v-for="m in messages" :key="m.id" :href="getLinkFromObj(m)">
        <ion-avatar class="msg-avatar">
          <img :src="getPfpFromObj(m)">
        </ion-avatar>
        <ion-label>
          <h2 v-if="m.type == 'studioactivity'">{{ m.title }}</h2>
          <h2 v-else>{{ m.actor_username }}</h2>
          <ion-note v-if="m.type == 'addcomment'">
            <ion-icon :icon="chatbubbleEllipses"></ion-icon> {{ m.comment_fragment }}
          </ion-note>
          <ion-note v-if="m.type == 'followuser'">
            <ion-icon :icon="personAdd"></ion-icon> followed you
          </ion-note>
          <ion-note v-if="m.type == 'loveproject'">
            <ion-icon :icon="heart"></ion-icon> loved {{ m.title }}
          </ion-note>
          <ion-note v-if="m.type == 'favoriteproject'">
            <ion-icon :icon="star"></ion-icon> favorited {{ m.project_title }}
          </ion-note>
          <ion-note v-if="m.type == 'studioactivity'">
            <ion-icon :icon="images"></ion-icon> new activity in studio
          </ion-note>
        </ion-label>
      </ion-item>
    </ion-item-group>
  </ion-content>
</ion-page>
</template>

<script>
// const utils = require('../utils.js');
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
  IonRefresher
} from '@ionic/vue';
import {
  chatbubbleEllipses,
  personAdd,
  heart,
  star,
  images
} from 'ionicons/icons';
import MessagesPageContent from '@/components/MessagesPageContent.vue';
export default {
  name: 'MessagesPage',
  components: {
    MessagesPageContent,
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
    IonRefresher
  },
  data() {
    return {
      session: (JSON.parse(window.localStorage.getItem('session')) || false)[0],
      messages: [],
      chatbubbleEllipses,
      personAdd,
      heart,
      star,
      images
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
        return `https://scratch.mit.edu/studios/${o.gallery_id}/activity`
      }
    },
    getPfpFromObj(o) {
      if (o.type == "studioactivity") {
        return `https://uploads.scratch.mit.edu/galleries/thumbnails/${o.gallery_id}.png`
      } else {
        return `https://uploads.scratch.mit.edu/users/avatars/${o.actor_id}.png`;
      }
    },
    async getMessages(offset, event) {
      const response = await fetch(`https://itchy-api.vercel.app/api/messages?user=${this.session.username}&offset=${offset || 0}&token=${this.session.token}`, {
        method: "GET"
      });
      let messages = await response.json();
      messages = this.htmlDecode(JSON.stringify(messages));
      messages = JSON.parse(messages);
      if (response.status == 200) {
        console.log(messages);
        this.messages = messages;
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
