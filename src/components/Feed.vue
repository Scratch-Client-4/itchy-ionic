<template>
  <ion-card :class="{ expanded: expanded }">
    <ion-card-header>
      <ion-card-title>
        <h2><ion-icon :icon="sparklesOutline"></ion-icon>Your Feed</h2>
        <ion-icon :icon="chevronDown" class="expand-icon" @click="expand" />
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <FeedItem
          v-for="i in events"
          :key="i"
          :i="i"
          @openProject="this.$emit('openProject', $event)"
          @openUser="this.$emit('openUser', $event)"
        />
      </ion-list>
      <ion-spinner v-if="loading" />
    </ion-card-content>
  </ion-card>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
import { App } from "@capacitor/app";
const { Http } = Plugins;
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonList,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { sparklesOutline, chevronDown } from "ionicons/icons";
import { defineComponent } from "vue";
import FeedItem from "@/components/FeedItem.vue";
const friendlyTime = require("friendly-time");
export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonList,
    IonIcon,
    IonSpinner,
    FeedItem,
  },
  emits: ["openProject", "openUser", "fullscreen"],
  data() {
    return {
      imageLoading: true,
      expanded: false,
      chevronDown,
      sparklesOutline,
      session: JSON.parse(window.localStorage.getItem("session"))
        ? JSON.parse(window.localStorage.getItem("session"))
        : null,
      events: [],
      loading: true,
    };
  },
  mounted() {
    this.loadFeed(4);
    App.addListener("backButton", () => {
      if (this.expanded) {
        this.expand();
      }
    });
  },
  methods: {
    expand() {
      this.$emit("fullscreen");
      if (this.expanded) {
        this.expanded = false;
        let newEvents = [];
        this.events.forEach((e, i) => {
          if (i < 4) {
            newEvents.push(e);
          }
        });
        this.events = newEvents;
      } else {
        this.expanded = true;
        this.loadFeed(30);
      }
    },
    loadFeed(count) {
      this.loading = true;
      Http.request({
        method: "GET",
        url: `https://api.scratch.mit.edu/users/${this.session.username}/following/users/activity?limit=${count}`,
        headers: {
          "X-Token": this.session.token,
        },
      }).then((response) => {
        if (response.status == 200) {
          this.events = [];
          console.log("Feed data: ", response.data);
          response.data.forEach((item) => {
            item.datetime_created = friendlyTime(
              new Date(item.datetime_created)
            );
            this.events.push(item);
          });
          this.loading = false;
        }
      });
    },
    visit(i) {
      const projectLinks = [
        "remixproject",
        "shareproject",
        "loveproject",
        "favoriteproject",
      ];
      const userLinks = ["followuser"];
      if (projectLinks.includes(i.type)) {
        this.$emit("openProject", i.project_id);
      } else if (userLinks.includes(i.type)) {
        this.$emit("openUser", i.followed_username);
      }
    },
  },
});
</script>
<style scoped>
ion-card {
  z-index: 200;
  margin-top: 3vw;
  margin-left: calc(10px + 1vw);
  margin-right: calc(10px + 1vw);
  width: auto;
  background: var(--gradient-bg);
}

h2 {
  margin: 0;
  color: white;
}

ion-icon {
  color: white;
  transform: translateY(4px);
  padding-right: 10px;
}

ion-label {
  color: white;
  margin-bottom: 4px;
  margin-top: 4px;
}

ion-label h3 {
  font-size: 0.8em !important;
  color: white;
}

ion-label p {
  font-size: 0.6em;
  color: white;
  opacity: 0.7;
}

.transparent-item {
  --ion-item-background: rgba(0, 0, 0, 0);
}

ion-list {
  background: transparent !important;
  max-height: calc(100vh - 7em);
  overflow-y: auto;
}

ion-item {
  border-radius: 5px;
}

ion-avatar {
  margin-bottom: 4px;
  margin-top: 4px;
}

ion-card-title {
  position: relative;
}

.expand-icon {
  position: absolute;
  top: 3px;
  right: 0;
  font-size: 1.5em;
  z-index: 1;
  transition: transform 0.2s;
}

ion-card.expanded {
  margin: 0;
  left: 0;
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 101;
  border-radius: 0;
}

.expanded .expand-icon {
  transform: rotate(-180deg);
}

ion-spinner {
  margin: auto;
  width: 100%;
  --color: white;
}
</style>
