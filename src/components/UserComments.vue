<template>
  <ion-content class="modaled ion-padding">
    <ion-progress-bar v-if="loading" type="indeterminate" />
    <div class="backbutton">
      <ion-back-button
        default-href="explore"
        @click="closeModal"
      ></ion-back-button>
      <ion-text>
        <h2>Comments: {{ title }}</h2>
      </ion-text>
    </div>
    <main class="comments">
      <div class="comment-parent" v-for="c in comments" :key="c.id">
        <div class="comment" @click="select(c.id)">
          <ion-avatar
            class="ion-activatable"
            @click="openUser(c.author.username)"
          >
            <img :src="c.author.image" alt="pfp" />
            <ion-ripple-effect />
          </ion-avatar>
          <div class="content">
            <div class="username">
              <span class="name">{{ c.author.username }}</span>
              <span class="owner" v-if="c.author.username == title">OWNER</span>
            </div>
            <div class="message">
              <p v-html="utils.replaceEmoji(c.content)"></p>
              <div class="info">
                <span v-if="c.replies.length > 0">
                  <ion-icon :icon="chatbubble" class="blue"></ion-icon>
                  <span class="reply-count">{{ c.replies.length }}</span>
                </span>
                <ion-icon :icon="time" class="blue"></ion-icon>
                <span class="timestamp">{{ c.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
        <transition name="list" class="replies">
          <div v-if="repliesSelected.includes(c.id)">
            <div v-for="r in c.replies" :key="r.id" class="comment reply">
              <ion-avatar
                class="ion-activatable"
                @click="openUser(r.author.username)"
              >
                <img :src="r.author.image" alt="pfp" />
                <ion-ripple-effect />
              </ion-avatar>
              <div class="content">
                <div class="username">
                  <span class="name">{{ r.author.username }}</span>
                  <span class="owner" v-if="r.author.username == title"
                    >OWNER</span
                  >
                </div>
                <div class="message">
                  <p v-html="utils.replaceEmoji(r.content)"></p>
                  <div class="info">
                    <ion-icon :icon="time" class="blue"></ion-icon>
                    <span class="timestamp">{{ r.timestamp }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>
    <ion-infinite-scroll
      @ionInfinite="loadComments($event)"
      threshold="100px"
      id="infinite-scroll"
    >
      <ion-infinite-scroll-content
        class="ion-padding"
        loading-spinner="circular"
        loading-text="Loading more comments..."
      >
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </ion-content>
</template>

<script>
import { Http } from "@capacitor-community/http";
import { App } from "@capacitor/app";
const utils = require("../utils.js");
const friendlyTime = require("friendly-time");
import UserModal from "@/components/UserModal.vue";
import {
  IonProgressBar,
  IonContent,
  IonBackButton,
  modalController,
  IonText,
  IonAvatar,
  IonIcon,
  IonRippleEffect,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { chatbubble, time } from "ionicons/icons";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserComments",
  emits: ["openUser"],
  props: {
    title: {
      type: String,
      default: "loading comments",
    },
    type: String,
  },
  data() {
    return {
      backgroundColor: "#303c54",
      textColor: "white",
      loading: true,
      comments: [],
      repliesSelected: [],
      chatbubble,
      time,
      friendlyTime,
      utils,
      offset: 1,
    };
  },
  components: {
    IonProgressBar,
    IonContent,
    IonBackButton,
    IonText,
    IonAvatar,
    IonIcon,
    IonRippleEffect,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  mounted() {
    App.addListener("backButton", () => {
      this.closeModal();
    });
    this.loadComments();
  },
  methods: {
    select(item) {
      if (this.repliesSelected.includes(item)) {
        const index = this.repliesSelected.indexOf(item);
        this.repliesSelected.splice(index, 1);
      } else {
        this.repliesSelected.push(item);
      }
    },
    closeModal() {
      modalController.dismiss();
    },
    loadComments(event) {
      if (this.type == "user") {
        Http.request({
          method: "GET",
          url: `https://itchy-api.vercel.app/api/user?user=${this.title}&comments=true&commentoffset=${this.offset}`,
        }).then((res) => {
          // const mentionRegex = /@(-?_?[A-Z]?[a-z]?[0-9]?)+/g;
          res.data.forEach((comment) => {
            comment.timestamp = friendlyTime(new Date(comment.timestamp));
            comment.replies.forEach((reply) => {
              reply.timestamp = friendlyTime(new Date(reply.timestamp));
            });
            this.comments.push(comment);
          });
          this.loading = false;
          this.offset++;
          if (event) {
            event.target.complete();
          }
        });
      }
    },
    async openUser(name) {
      if (name == this.title) {
        this.closeModal();
        return;
      }
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username: name,
        },
      });
      return modal.present();
    },
    timestamp(date) {
      return this.friendlyTime(new Date(date));
    },
  },
});
</script>
<style scoped>
ion-title {
  margin: auto;
  padding-right: 75px;
  text-align: center;
}

ion-progress-bar {
  transform: translateX(-16px);
}

.backbutton {
  background: var(--ion-toolbar-background, white);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  color: var(--ion-text-color);
  box-shadow: 3px 10px rgba(0, 0, 0, 0.2);
}

.backbutton ion-back-button {
  float: left;
  padding: 3px;
}

.backbutton h2 {
  margin-top: 0.6em;
  font-size: 1.3em;
  text-overflow: ellipsis;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
}

.comments {
  margin-top: 50px;
}

.comment {
  display: grid;
  grid-template-columns: auto 1fr;
  font-size: 0.85rem;
  column-gap: 1rem;
  margin-top: 0;
  background: transparent;
  padding: 0.5rem 0.25rem;
}

.comment ion-avatar {
  height: 40px;
  width: 40px;
}

.comment .content {
  text-align: left;
}

.content .username {
  margin-bottom: 5px;
  font-weight: bold;
}

.username .name {
  opacity: 0.5;
}

.message > p {
  margin: 5px 0;
}

.info {
  opacity: 0.25;
}

.info ion-icon {
  transform: translateY(1.5px);
  margin-right: 3px;
}

.info span {
  margin-right: 0.5em;
}

ion-avatar {
  overflow: hidden;
  position: relative;
}

.owner {
  background: var(--ion-color-primary-shade);
  font-size: 0.8em;
  padding: 0.2em 0.5em;
  margin-left: 0.6em;
  border-radius: 1em;
}

.replies {
  height: auto;
  max-height: auto;
}

.reply {
  margin-left: 1.25rem;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
  transform-origin: top center;
  max-height: 100vh;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

ion-progress-bar {
  z-index: 15;
}
</style>
