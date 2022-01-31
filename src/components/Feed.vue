<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        <h2><ion-icon :icon="sparklesOutline"></ion-icon>Your Feed</h2>
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
    </ion-card-content>
  </ion-card>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
const { Http } = Plugins;
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonList,
  IonIcon,
} from "@ionic/vue";
import { sparklesOutline } from "ionicons/icons";
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
    FeedItem,
  },
  emits: ["openProject", "openUser"],
  data() {
    return {
      imageLoading: true,
      sparklesOutline,
      session: JSON.parse(window.localStorage.getItem("session"))
        ? JSON.parse(window.localStorage.getItem("session"))
        : null,
      events: [],
    };
  },
  mounted() {
    this.loadFeed();
  },
  methods: {
    loadFeed() {
      Http.request({
        method: "GET",
        url: `https://api.scratch.mit.edu/users/${this.session.username}/following/users/activity?limit=4`,
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
}

ion-item {
  border-radius: 5px;
}

ion-avatar {
  margin-bottom: 4px;
  margin-top: 4px;
}
</style>
