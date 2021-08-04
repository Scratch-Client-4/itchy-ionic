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
        <Message v-for="m in messages" :key="m.id" :selectedMessage="selectedMessage" :m="m" @expand="expandMessage(m.id)"></Message>
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
import Message from '@/components/Message.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItemGroup,
  IonRefresher,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';
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
    IonRefresher,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    Message
  },
  data() {
    return {
      session: JSON.parse(window.localStorage.getItem('session')) ? JSON.parse(window.localStorage.getItem('session'))[0] : null,
      messages: [],
      currentOffset: 0,
      selectedMessage: null
    }
  },
  created() {
    if (this.session) {
      this.getMessages();
    }
  },
  methods: {
    expandMessage(id) {
      this.selectedMessage = id;
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
