<template>
  <ion-item
    button
    class="transparent-item ripple-parent ion-activatable"
    @click="visit(i)"
    lines="none"
  >
    <ion-avatar slot="start" @click.stop="openUser(i)">
      <img
        v-if="i.type != 'becomeownerstudio'"
        :src="`https://cdn2.scratch.mit.edu/get_image/user/${i.actor_id}_60x60.png`"
      />
      <img
        v-else
        :src="`https://cdn2.scratch.mit.edu/get_image/user/${i.recipient_id}_60x60.png`"
      />
    </ion-avatar>
    <ion-label>
      <h2 v-if="i.type != 'becomeownerstudio'">{{ i.actor_username }}</h2>
      <h2 v-else>{{ i.recipient_username }}</h2>
      <h3>
        <span v-if="i.type == 'shareproject'">shared {{ i.title }}</span>
        <span v-if="i.type == 'loveproject'">loved {{ i.title }}</span>
        <span v-if="i.type == 'favoriteproject'"
          >favorited {{ i.project_title }}</span
        >
        <span v-if="i.type == 'remixproject'"
          >remixed {{ i.parent_title }} as {{ i.title }}</span
        >
        <span v-if="i.type == 'followuser'"
          >followed {{ i.followed_username }}</span
        >
        <span v-if="i.type == 'becomecurator'"
          >started curating {{ i.title }}</span
        >
        <span v-if="i.type == 'becomeownerstudio'">
          was promoted to manager of {{ i.gallery_title }}</span
        >
        <span v-if="i.type == 'followstudio'"
          >followed the {{ i.title }} studio</span
        >
      </h3>
      <p>{{ i.datetime_created }}</p>
    </ion-label>
    <ion-ripple-effect></ion-ripple-effect>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonRippleEffect, IonAvatar } from "@ionic/vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    IonItem,
    IonLabel,
    IonRippleEffect,
    IonAvatar,
  },
  props: {
    i: Object,
  },
  emits: ["openProject", "openUser"],
  data() {
    return {
      imageLoading: true,
    };
  },
  created() {
    console.log(this.i);
  },
  methods: {
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
    openUser(i) {
      if (i.type != "becomeownerstudio") {
        this.$emit("openUser", i.actor_username);
      } else {
        this.$emit("openUser", i.recipient_username);
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
