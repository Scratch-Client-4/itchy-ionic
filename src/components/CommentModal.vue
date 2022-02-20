<template>
  <ion-content
    class="modaled ion-padding"
    :scroll-events="true"
    @ionScroll="scroll($event)"
  >
    <transition name="opacity">
      <ion-progress-bar
        v-if="loading"
        type="determinate"
        :value="loadingStatus / 1"
      />
    </transition>
    <div class="backbutton" :style="{ background: headerColor }">
      <ion-back-button
        default-href="explore"
        @click="closeModal"
      ></ion-back-button>
      <ion-text>
        <transition name="fade">
          <h2 v-if="showHeader">Comments: {{ title }}</h2>
        </transition>
      </ion-text>
    </div>
    <main class="comments">
      <div v-for="c in comments" :key="c.id" class="comment">
        <ion-avatar>
          <img :src="c.author.image" alt="pfp" />
        </ion-avatar>
        <div class="content" v-html="c.content"></div>
      </div>
    </main>
  </ion-content>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
import { App } from "@capacitor/app";
const { Http } = Plugins;
import {
  IonProgressBar,
  IonContent,
  IonBackButton,
  modalController,
  IonText,
  IonAvatar,
} from "@ionic/vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CommentModal",
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
      loadingStatus: 0,
      comments: [],
      showHeader: false,
      headerColor: "transparent",
    };
  },
  components: {
    IonProgressBar,
    IonContent,
    IonBackButton,
    IonText,
    IonAvatar,
  },
  mounted() {
    App.addListener("backButton", () => {
      this.closeModal();
    });
    this.loadComments();
  },
  methods: {
    select(item) {
      console.log("Selected", item);
      this.selected = item;
    },
    closeModal() {
      modalController.dismiss();
    },
    scroll(e) {
      if (e.detail.scrollTop > 135) {
        this.showHeader = true;
        this.headerColor = this.backgroundColor;
      } else {
        this.showHeader = false;
        this.headerColor = "transparent";
      }
    },
    loadComments() {
      if (this.type == "user") {
        Http.request({
          method: "GET",
          url: `https://itchy-api.vercel.app/api/user?user=${this.title}&comments=true`,
        }).then((res) => {
          this.comments = res.data;
        });
      }
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
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  color: white;
}

.backbutton ion-back-button {
  float: left;
  padding: 3px;
}

.backbutton h2 {
  margin-top: 0.6em;
  font-size: 1.3em;
}

.comments {
  margin: 0 2vw;
}

.comment {
  display: grid;
  grid-template-columns: auto auto;
  font-size: 0.85rem;
  column-gap: 1rem;
  margin-top: 0.75rem;
  background: var(--ion-color-step-100);
  padding: 0.75rem;
  border-radius: 0.25rem;
}

.comment ion-avatar {
  height: 50px;
  width: 50px;
}

.comment .content {
  text-align: left;
}
</style>
