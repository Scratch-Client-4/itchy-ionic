<template>
  <ion-card>
    <ion-card-content>
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
    </ion-card-content>
  </ion-card>
</template>

<script>
import "@capacitor-community/http";
import { Plugins } from "@capacitor/core";
const { Http } = Plugins;
import { IonCard, IonCardContent, IonList } from "@ionic/vue";
import { defineComponent } from "vue";
import FeedItem from "@/components/FeedItem.vue";
// const friendlyTime = require("friendly-time");
import { parse } from "node-html-parser";
export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonList,
    FeedItem,
  },
  props: {
    username: String,
  },
  emits: ["openProject", "openUser"],
  data() {
    return {
      imageLoading: true,
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
        url: `https://scratch.mit.edu/messages/ajax/user-activity/?user=${this.username}&max=5`,
      }).then((res) => {
        Http.request({
          method: "GET",
          url: `https://api.scratch.mit.edu/users/${this.username}`,
        }).then((user) => {
          let unparsed = res.data;
          unparsed = parse(unparsed);
          unparsed = unparsed.querySelectorAll("li");
          for (let i = 0; i <= unparsed.length; i++) {
            let obj = {};
            const selected = unparsed[i].querySelector("div");
            obj.actor_username = this.username;
            obj.actor_id = user.data.id;
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
          console.log(this.events);
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
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 0;
  width: 93.5%;
  display: inline-block;
  scroll-snap-align: start;
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
}

ion-item {
  border-radius: 5px;
}

ion-avatar {
  margin-bottom: 4px;
  margin-top: 4px;
}
</style>
