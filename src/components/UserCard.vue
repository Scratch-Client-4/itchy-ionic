<template>
  <div class="parent">
    <ion-avatar @click="openAuthor($event)" class="ion-activatable">
      <img
        alt="ion"
        :src="
          imageLoading
            ? './assets/avatar.png'
            : `https://uploads.scratch.mit.edu/get_image/user/${id}_128x128.png`
        "
        @load="imageLoading = false"
      />
      <ion-ripple-effect />
    </ion-avatar>
    <br />
    <ion-text>
      <p>
        {{ name }}<br />
        <span
          ><ion-icon :icon="personAdd" />
          {{ utils.formatNumber(followers) }}</span
        >
      </p>
    </ion-text>
  </div>
</template>

<style scoped>
.parent {
  text-align: center;
  margin: 10px;
}

ion-avatar,
img {
  width: 75px;
  height: 75px;
  max-width: 75px;
  display: block;
  margin: auto;
}

ion-text p {
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75px;
  margin-top: 0;
  margin-bottom: 5px;
  line-height: 1.5em;
}

p span {
  color: var(--ion-color-medium-shade);
}

ion-icon {
  transform: translateY(2px);
}

.ion-activatable {
  position: relative;
  overflow: hidden;
}
</style>

<script>
import {
  IonAvatar,
  IonText,
  IonRippleEffect,
  modalController,
} from "@ionic/vue";
import { personAdd } from "ionicons/icons";
import { defineComponent } from "vue";
import UserModal from "./UserModal.vue";
const utils = require("../utils.js");
export default defineComponent({
  components: {
    IonAvatar,
    IonText,
    IonRippleEffect,
  },
  data() {
    return {
      imageLoading: true,
      personAdd,
      utils,
    };
  },
  props: {
    name: {
      type: String,
      default: "loading...",
    },
    id: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    async openAuthor(event) {
      event.stopPropagation();
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username: this.name,
        },
      });
      return modal.present();
    },
  },
});
</script>
