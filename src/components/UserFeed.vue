<template>
  <ion-card :class="{ expanded: open }">
    <ion-card-content>
      <ion-icon :icon="chevronDown" class="expand-icon" @click="expand" />
      <ion-list>
        <FeedItem
          v-for="i in events"
          :key="i"
          :i="i"
          @openProject="this.$emit('openProject', $event)"
          @openUser="this.$emit('openUser', $event)"
          :showAvatar="false"
        />
      </ion-list>
      <ion-spinner v-if="loading" />
    </ion-card-content>
  </ion-card>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
const { Http } = Plugins;
import { chevronDown } from "ionicons/icons";
import { IonCard, IonCardContent, IonList, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";
import FeedItem from "@/components/FeedItem.vue";
// const friendlyTime = require("friendly-time");
import { parse } from "node-html-parser";
export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonList,
    IonIcon,
    FeedItem,
  },
  props: {
    username: String,
    open,
  },
  emits: ["openProject", "openUser", "fullscreen"],
  data() {
    return {
      imageLoading: true,
      loading: false,
      events: [],
      chevronDown,
    };
  },
  mounted() {
    this.loadFeed(4);
  },
  methods: {
    expand() {
      if (this.open) {
        this.$emit("expand", false);
        let newEvents = [];
        this.events.forEach((e, i) => {
          if (i < 4) {
            newEvents.push(e);
          }
        });
        this.events = newEvents;
      } else {
        this.$emit("expand", true);
        this.loadFeed(30);
      }
    },
    loadFeed(count) {
      this.loading = true;
      Http.request({
        method: "GET",
        url: `https://scratch.mit.edu/messages/ajax/user-activity/?user=${this.username}&max=${count}`,
      }).then((res) => {
        Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.username}`,
        }).then((user) => {
          let unparsed = res.data;
          unparsed = parse(unparsed);
          unparsed = unparsed.querySelectorAll("li");
          this.loading = false;
          for (let i = 0; i <= unparsed.length; i++) {
            let obj = {};
            const selected = unparsed[i].querySelector("div");
            obj.actor_username = this.username;
            obj.actor_id = user.data.id;
            obj.datetime_created = unparsed[i].querySelector(".time").innerText;
            switch (
              selected.childNodes[2].innerText.replace(/\s+/g, " ").trim()
            ) {
              case "became a curator of": {
                obj.type = "becomecurator";
                obj.title = selected.childNodes[3].innerText;
                break;
              }
              case "added": {
                obj.type = "addproject";
                obj.title = selected.childNodes[3].innerText;
                obj.project_id = Number(
                  selected.childNodes[3].getAttribute("href").split("/")[2]
                );
                obj.gallery_title = selected.childNodes[5].innerText;
                break;
              }
              case "shared the project": {
                obj.type = "shareproject";
                obj.title = selected.childNodes[3].innerText;
                obj.project_id = Number(
                  selected.childNodes[3].getAttribute("href").split("/")[2]
                );
                break;
              }
              case "loved": {
                obj.type = "loveproject";
                obj.title = selected.childNodes[3].innerText;
                obj.project_id = Number(
                  selected.childNodes[3].getAttribute("href").split("/")[2]
                );
                break;
              }
              case "favorited": {
                obj.type = "favoriteproject";
                obj.project_title = selected.childNodes[3].innerText;
                obj.project_id = Number(
                  selected.childNodes[3].getAttribute("href").split("/")[2]
                );
                break;
              }
              case "is now following": {
                obj.type = "followuser";
                obj.followed_username = selected.childNodes[3].innerText;
                break;
              }
              case "was promoted to manager of": {
                obj.type = "becomeownerstudio";
                obj.recipient_id = obj.actor_id;
                obj.recipient_username = this.username;
                delete obj.actor_id;
                delete obj.actor_username;
                obj.gallery_title = selected.childNodes[3].innerText;
                obj.gallery_id = Number(
                  selected.childNodes[3].getAttribute("href").split("/")[2]
                );
              }
            }
            this.events.push(obj);
          }
        });
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
  margin: auto;
  flex: 0 0 auto;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 0;
  width: 93.5%;
  display: inline-block;
  scroll-snap-align: center;
  align-self: stretch;
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
  max-height: calc(100vh - 1em);
  overflow-y: auto;
}

ion-item {
  border-radius: 5px;
}

ion-avatar {
  margin-bottom: 4px;
  margin-top: 4px;
}

ion-card-content {
  position: relative;
}

.expand-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2em;
  z-index: 1;
  transition: transform 0.2s;
}

ion-card.expanded {
  left: -6%;
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 3;
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
