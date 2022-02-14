<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Messages</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-refresher slot="fixed" @ionRefresh="getMessages(0, $event, true)">
        <ion-refresher-content
          pulling-text="refresh messages"
          refreshing-text="refreshing messages..."
        ></ion-refresher-content>
      </ion-refresher>
      <MessagesSignIn v-if="!session" />
      <div v-else>
        <ion-item-group>
          <ion-item-divider v-if="adminMessages.length > 0">
            <ion-label>From the Scratch Team</ion-label>
          </ion-item-divider>
          <Message
            v-for="m in adminMessages"
            :key="m.id"
            :selectedMessage="selectedMessage"
            :m="m"
            @expand="expandMessage(m.id)"
            :isUnread="true"
            :isAdmin="true"
          />
          <Message
            v-for="(m, i) in messages"
            :key="m.id"
            :selectedMessage="selectedMessage"
            :m="m"
            @expand="expandMessage(m.id)"
            :isUnread="i < messageCount"
            :lastRead="i == messageCount"
            :firstUnread="i == 0 && messageCount > 0"
          />
        </ion-item-group>
        <ion-infinite-scroll
          @ionInfinite="getMessages(currentOffset, $event, false)"
          threshold="100px"
          id="infinite-scroll"
        >
          <ion-infinite-scroll-content
            class="ion-padding"
            loading-spinner="circular"
            loading-text="Loading more messages..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <!--<ion-fab vertical="bottom" horizontal="end" edge slot="fixed">
        <ion-fab-button @click="markAsRead">
          <ion-icon :icon="mailOpenOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
const { Http } = Plugins;
const utils = require("../utils.js");
import Message from "@/components/Message.vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  //IonFab,
  //IonFabButton
} from "@ionic/vue";
import { mailOpenOutline } from "ionicons/icons";
import MessagesSignIn from "@/components/MessagesSignIn.vue";
export default {
  name: "MessagesPage",
  components: {
    MessagesSignIn,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    //IonFab,
    //IonFabButton,
    Message,
  },
  data() {
    return {
      session: JSON.parse(window.localStorage.getItem("session"))
        ? JSON.parse(window.localStorage.getItem("session"))
        : null,
      messages: [],
      currentOffset: 0,
      selectedMessage: null,
      messageCount: 0,
      mailOpenOutline,
      adminMessages: [],
    };
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
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${
            this.session.username
          }/messages?offset=${offset || 0}`,
          headers: {
            "x-requested-with": "XMLHttpRequest",
            origin: "https://scratch.mit.edu/",
            referer: `https://scratch.mit.edu/`,
            "x-token": this.session.token,
          },
        });
        let messages = await response.data;
        console.log(messages);
        if (reset) {
          this.messages = [];
        }
        const count = await Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.session.username}/messages/count`,
          headers: {
            "x-requested-with": "XMLHttpRequest",
          },
        });

        const adminMessages = await Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.session.username}/messages/admin`,
          headers: {
            "x-requested-with": "XMLHttpRequest",
            origin: "https://scratch.mit.edu/",
            referer: `https://scratch.mit.edu/`,
            "x-token": this.session.token,
          },
        });
        this.adminMessages = [];
        await adminMessages.data.forEach((message) => {
          message.type = "admin";
          this.adminMessages.push(message);
        });
        this.messageCount =
          (await count.data.count) - this.adminMessages.length;
        messages.forEach((m) => {
          if (m.comment_fragment) {
            //eslint-disable-next-line
            let str = m.comment_fragment.replace(/&quot;/g, '"');
            m.comment_fragment = utils.decodeEntities(str);
          }
          if (m.title) {
            //eslint-disable-next-line
            let str = m.title.replace(/&quot;/g, '"');
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
          this.presentAlert("Error", response.status, "OK");
        }
      } else {
        if (event) {
          event.target.complete();
        } else {
          this.loading = false;
        }
      }
    },
    markAsRead() {
      Http.request({
        method: "GET",
        url: "https://itchy-api.vercel.app/api/csrf",
      }).then((token) => {
        token = token.data;
        Http.setCookie({
          url: "scratch.mit.edu",
          key: "scratchsessionsid",
          value:
            '".eJxVUEFugzAQ_IvPCcUYsJMbzaWnSI2qVj2hxV7AkNgITKO26t-7lrjktprZmZ3ZX7YuODu4ITuyfTXr3rs927Ea1tDXkautISrnGS-llEQFXIL2frRRcvfziOZR0IAe0UVVxNAFqyFY75KNWJILTtcNfN6WydfTQCLUedZAnpqSJgklHGQh2jJPVarUQRyOJ1HJ09sEX99h0OEynHVRvbzO_fvHnWyuvrNubydy4iIpyoQXRZIJETNewXUrdDE4ndoxMxDg62Bv-ONdhKsbzpTs6Yz3-pO6PTbrYelpKeP0DgFYKFCtRoOyFblOM8N5I0qFQhvJpVLs7x9aonDA:1mvq2n:ZdhLIy6HClCUD55nHvh2jdFjXJA"',
        }).then(() => {
          Http.request({
            method: "POST",
            url: "https://scratch.mit.edu/site-api/messages/messages-clear/?sareferer",
            headers: {
              "x-requested-with": "XMLHttpRequest",
              origin: "https://scratch.mit.edu/",
              referer: `https://scratch.mit.edu/messages`,
              "x-token": this.session.token,
              "x-csrftoken": token.replace(/(\r\n|\n|\r)/gm, ""),
              Cookie:
                `scratchlanguage=en; scratchcsrftoken=${token}; scratchsessionsid=".eJxVUEFugzAQ_IvPCcUYsJMbzaWnSI2qVj2hxV7AkNgITKO26t-7lrjktprZmZ3ZX7YuODu4ITuyfTXr3rs927Ea1tDXkautISrnGS-llEQFXIL2frRRcvfziOZR0IAe0UVVxNAFqyFY75KNWJILTtcNfN6WydfTQCLUedZAnpqSJgklHGQh2jJPVarUQRyOJ1HJ09sEX99h0OEynHVRvbzO_fvHnWyuvrNubydy4iIpyoQXRZIJETNewXUrdDE4ndoxMxDg62Bv-ONdhKsbzpTs6Yz3-pO6PTbrYelpKeP0DgFYKFCtRoOyFblOM8N5I0qFQhvJpVLs7x9aonDA:1mvq2n:ZdhLIy6HClCUD55nHvh2jdFjXJA"`.replace(
                  /(\r\n|\n|\r)/gm,
                  ""
                ),
            },
          });
        });
      });
    },
    htmlDecode(input) {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    },
  },
};
</script>
<style scoped>
ion-fab {
  position: fixed;
  bottom: 10px;
}
</style>
