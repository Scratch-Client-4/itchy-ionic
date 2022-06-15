<template>
  <ion-item-divider v-if="firstUnread">
    <ion-label>Unread</ion-label>
  </ion-item-divider>
  <ion-item-divider v-if="lastRead">
    <ion-label>Last Read</ion-label>
  </ion-item-divider>
  <ion-item
    button
    @click="expandMessage()"
    :class="{
      'message-wrapped': selectedMessage == m.id,
      'no-ripple': false,
      'message-unread': isUnread,
    }"
  >
    <ion-avatar class="msg-avatar" @click="openAuthor(m)">
      <img :src="getPfpFromObj(m)" />
    </ion-avatar>
    <ion-label :class="{ 'ion-text-wrap': selectedMessage == m.id }">
      <h2 v-if="m.type == 'studioactivity'">{{ m.title }}</h2>
      <h2 v-else-if="m.type == 'admin'">Notification</h2>
      <h2 v-else>{{ m.actor_username }}</h2>
      <ion-note v-if="m.type == 'addcomment'">
        <ion-icon :icon="chatbubbleEllipses" class="blue"></ion-icon>
        {{ m.comment_fragment }}
      </ion-note>
      <ion-note v-if="m.type == 'followuser'">
        <ion-icon :icon="personAdd" class="blue"></ion-icon> followed you
      </ion-note>
      <ion-note v-if="m.type == 'loveproject'">
        <ion-icon :icon="heart" class="red"></ion-icon> loved {{ m.title }}
      </ion-note>
      <ion-note v-if="m.type == 'favoriteproject'">
        <ion-icon :icon="star" class="yellow"></ion-icon> favorited
        {{ m.project_title }}
      </ion-note>
      <ion-note v-if="m.type == 'studioactivity'">
        <ion-icon :icon="images" class="blue"></ion-icon> new activity in studio
      </ion-note>
      <ion-note v-if="m.type == 'remixproject'">
        <ion-icon :icon="colorPalette" class="blue"></ion-icon> remixed your
        project {{ m.parent_title }}
      </ion-note>
      <ion-note v-if="m.type == 'curatorinvite'">
        <ion-icon :icon="images" class="blue"></ion-icon> invited you to curate
        {{ m.title }}
      </ion-note>
      <ion-note v-if="m.type == 'becomeownerstudio'">
        <ion-icon :icon="images" class="blue"></ion-icon> promoted you to
        curator of {{ m.gallery_title }}
      </ion-note>
      <ion-note v-if="m.type == 'becomehoststudio'">
        <ion-icon :icon="images" class="blue"></ion-icon> made you host of
        {{ m.gallery_title }}
      </ion-note>
      <ion-note v-if="m.type == 'forumpost'">
        <ion-icon :icon="images" class="blue"></ion-icon> made a post in
        {{ m.topic_title }}
      </ion-note>
      <ion-note v-if="m.type == 'admin'">
        <ion-icon :icon="images" class="blue"></ion-icon> {{ m.message }}
      </ion-note>
      <ion-note class="details" v-if="selectedMessage == m.id"
        ><br />
        {{ friendlyTime(new Date(m.datetime_created)) }}
        <span v-if="m.type == 'addcomment' && m.comment_type == 0"
          >on {{ m.comment_obj_title }}</span
        >
        <span v-if="m.type == 'addcomment' && m.comment_type == 1">
          <span v-if="m.comment_obj_title == myUsername">on your profile</span>
          <span v-else>on {{ m.comment_obj_title }}'s profile</span>
        </span>
        <span v-if="m.type == 'addcomment' && m.comment_type == 2"
          >in {{ m.comment_obj_title }}</span
        >
      </ion-note>
      <ion-grid v-if="selectedMessage == m.id">
        <ion-row>
          <ion-col
            v-if="
              m.type == 'studioactivity' ||
              m.type == 'curatorinvite' ||
              m.type == 'becomeownerstudio' ||
              m.type == 'becomehoststudio'
            "
            @click="openStudio(m)"
          >
            <div class="ion-activatable btn-div">
              <ion-icon :icon="arrowRedoCircle" class="blue action"></ion-icon>
              <div>Open on Scratch</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'remixproject'" @click="openFromObj(m)">
            <div class="ion-activatable btn-div">
              <ion-icon :icon="image" class="blue action"></ion-icon>
              <div>Open original</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'forumpost'" @click="openFromObj(m)">
            <div class="ion-activatable btn-div">
              <ion-icon :icon="chatbubbles" class="blue action"></ion-icon>
              <div>Open thread</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'remixproject'" @click="openFromObj(m)">
            <div class="ion-activatable btn-div">
              <ion-icon :icon="colorPalette" class="blue action"></ion-icon>
              <div>Open remix</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col
            v-if="m.type == 'followuser'"
            @click="followUser(m)"
            style="transform: translate(0, 0)"
          >
            <div class="ion-activatable btn-div">
              <ion-badge color="primary">BETA</ion-badge>
              <ion-icon :icon="personAdd" class="blue action"></ion-icon>
              <div>Follow back</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col
            v-if="
              m.type == 'followuser' ||
              m.type == 'loveproject' ||
              m.type == 'favoriteproject' ||
              m.type == 'becomeownerstudio' ||
              m.type == 'becomehoststudio'
            "
            @click="openUserInBrowser(m)"
          >
            <div class="ion-activatable btn-div">
              <ion-icon
                :icon="chatbubbleEllipses"
                class="blue action"
              ></ion-icon>
              <div>Say thanks</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'addcomment'" @click="openFromObj(m)">
            <div class="ion-activatable btn-div">
              <ion-icon
                :icon="chatbubbleEllipses"
                class="blue action"
              ></ion-icon>
              <div>Reply</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'addcomment'" @click="openFromObj(m)">
            <div class="ion-activatable btn-div">
              <ion-icon :icon="arrowRedoCircle" class="blue action"></ion-icon>
              <div>View comment</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col
            v-if="m.type == 'loveproject' || m.type == 'favoriteproject'"
            @click="openFromObj(m)"
          >
            <div class="ion-activatable btn-div">
              <ion-icon :icon="image" class="blue action"></ion-icon>
              <div>Open project</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
          <ion-col v-if="m.type == 'curatorinvite'" @click="joinStudio(m)">
            <div class="ion-activatable btn-div">
              <ion-badge color="primary">BETA</ion-badge>
              <ion-icon :icon="checkmarkCircle" class="blue action"></ion-icon>
              <div>Accept invite</div>
              <ion-ripple-effect></ion-ripple-effect>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-label>
  </ion-item>
</template>
<script>
import { Http } from "@capacitor-community/http";
import { Browser } from "@capacitor/browser";
const friendlyTime = require("friendly-time");
import UserModal from "./UserModal.vue";
import { defineComponent } from "vue";
import {
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  IonAvatar,
  IonRippleEffect,
  IonBadge,
  IonGrid,
  IonCol,
  IonRow,
  IonItemDivider,
  toastController,
  modalController,
} from "@ionic/vue";
import {
  chatbubbleEllipses,
  personAdd,
  heart,
  star,
  images,
  image,
  colorPalette,
  arrowRedoCircle,
  ellipse,
  checkmarkCircle,
  chatbubbles,
} from "ionicons/icons";
export default defineComponent({
  name: "Message",
  inheritAttrs: false,
  components: {
    IonItem,
    IonIcon,
    IonLabel,
    IonNote,
    IonAvatar,
    IonRippleEffect,
    IonBadge,
    IonGrid,
    IonCol,
    IonRow,
    IonItemDivider,
  },
  props: {
    selectedMessage: Number,
    m: Object,
    isUnread: Boolean,
    firstUnread: Boolean,
    lastRead: Boolean,
    myUsername: String,
  },
  emits: ["expand"],
  data() {
    return {
      chatbubbleEllipses,
      personAdd,
      heart,
      star,
      images,
      image,
      ellipse,
      colorPalette,
      arrowRedoCircle,
      checkmarkCircle,
      chatbubbles,
      friendlyTime,
      session: JSON.parse(window.localStorage.getItem("session"))
        ? JSON.parse(window.localStorage.getItem("session"))
        : null,
      followText: "Follow back",
    };
  },
  methods: {
    async openAuthor(o) {
      const modal = await modalController.create({
        component: UserModal,
        cssClass: "open-modal",
        componentProps: {
          username:
            o.type == "admin" || o.actor_username == "systemuser"
              ? "ScratchCat"
              : o.actor_username,
        },
      });
      return modal.present();
    },
    expandMessage() {
      console.log(this.myUsername, this.m.comment_obj_title);
      this.$emit("expand");
    },
    async openStudio(m) {
      await Browser.open({
        url: `https://scratch.mit.edu/studios/${m.gallery_id}`,
        toolbarColor: "#4E97FF",
      });
    },
    async openFromObj(o) {
      if (o.type == "addcomment") {
        if (o.comment_type == 0) {
          await Browser.open({
            url: `https://scratch.mit.edu/projects/${o.comment_obj_id}/#comments-${o.comment_id}`,
            toolbarColor: "#4E97FF",
          });
        } else if (o.comment_type == 1) {
          await Browser.open({
            url: `https://scratch.mit.edu/users/${o.comment_obj_title}/#comments-${o.comment_id}`,
            toolbarColor: "#4E97FF",
          });
        } else if (o.comment_type == 2) {
          await Browser.open({
            url: `https://scratch.mit.edu/studios/${o.comment_obj_id}/comments/#comments-${o.comment_id}`,
            toolbarColor: "#4E97FF",
          });
        }
      } else if (o.type == "followuser") {
        await Browser.open({
          url: `https://scratch.mit.edu/users/${o.actor_username}`,
          toolbarColor: "#4E97FF",
        });
      } else if (o.type == "favoriteproject" || o.type == "loveproject") {
        await Browser.open({
          url: `https://scratch.mit.edu/projects/${o.project_id}`,
          toolbarColor: "#4E97FF",
        });
      } else if (o.type == "studioactivity") {
        await Browser.open({
          url: `https://scratch.mit.edu/studios/${o.gallery_id}`,
          toolbarColor: "#4E97FF",
        });
      } else if (o.type == "forumpost") {
        await Browser.open({
          url: `https://scratch.mit.edu/discuss/topic/${o.topic_id}/unread`,
        });
      }
    },
    async followUser(o, session) {
      session = JSON.parse(window.localStorage.getItem("session"));
      session.session = session.session.replace("\\", "");
      session.session = session.session.replace('"', "");
      console.log(session);
      await Http.setCookie({
        url: "https://scratch.mit.edu",
        key: "scratchsessionsid",
        value: `"${session.session}"`,
      });
      await Http.setCookie({
        url: "https://scratch.mit.edu",
        key: "scratchcsrftoken",
        value: "a",
      });
      console.log(
        await Http.getCookies({
          url: "https://scratch.mit.edu",
        })
      );
      const reqOpts = {
        method: "PUT",
        url: `https://scratch.mit.edu/site-api/users/followers/${o.actor_username}/add/?usernames=${session.username}`,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/users/${o.actor_username}`,
          "x-csrftoken": "a",
          Cookie: `scratchcsrftoken=a;scratchsessionsid="${session.session}"`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        },
        data: {
          id: o.actor_username,
          userId: o.actor_id,
          username: o.actor_username,
          thumbnail_url: `//uploads.scratch.mit.edu/users/avatars/${o.actor_id}.png`,
          comments_allowed: true,
        },
        webFetchExtra: {
          credentials: "include",
        },
      };
      const res = await Http.request(reqOpts);
      await Http.request({
        method: "GET",
        url: `https://scratch.mit.edu/csrf_token`,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/`,
          "x-csrftoken": "a",
          Cookie: `scratchcsrftoken=a;scratchsessionsid="${session.session}"`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        },
        webFetchExtra: {
          credentials: "include",
        },
      });
      if (res.status == 200) {
        this.toastNotif(`You are following ${o.actor_username}`);
      } else {
        this.toastNotif(`Error: ${res.status}`);
      }
    },
    async openUserInBrowser(o) {
      await Browser.open({
        url: `https://scratch.mit.edu/users/${o.actor_username}`,
        toolbarColor: "#4E97FF",
      });
    },
    async joinStudio(o, session) {
      session = JSON.parse(window.localStorage.getItem("session"));
      console.log(session);
      const cookieOpts = {
        url: "https://scratch.mit.edu",
        key: "scratchcsrftoken",
        value: "a",
      };
      await Http.setCookie(cookieOpts);
      const reqOpts = {
        method: "PUT",
        url: `https://scratch.mit.edu/site-api/users/curators-in/${o.gallery_id}/add/?usernames=${session.username}`,
        headers: {
          "x-requested-with": "XMLHttpRequest",
          origin: "https://scratch.mit.edu/",
          referer: `https://scratch.mit.edu/studios/${o.gallery_id}/curators`,
          "x-token": session.token,
          "x-csrftoken": "a",
          cookie: "scratchcsrftoken=a;",
        },
      };
      const res = await Http.request(reqOpts);
      if (res.status == 200) {
        this.toastNotif(`You are a curator of ${o.title}`);
      } else {
        console.error(res.statusText);
      }
    },
    async toastNotif(content) {
      const toast = await toastController.create({
        message: content,
        duration: 3500,
        color: "light",
      });
      return toast.present();
    },
    getPfpFromObj(o) {
      if (o.type == "studioactivity") {
        return `https://uploads.scratch.mit.edu/galleries/thumbnails/${o.gallery_id}.png`;
      } else if (o.type == "admin") {
        return `https://uploads.scratch.mit.edu/users/avatars/15883188.png`;
      } else {
        return `https://uploads.scratch.mit.edu/users/avatars/${o.actor_id}.png`;
      }
    },
  },
});
</script>
<style scoped>
ion-icon.blue {
  color: #4d97ff;
}

ion-icon.gray {
  color: #7d7d7d;
}

ion-icon.red {
  color: #ff6680;
}

ion-icon.yellow {
  color: #ffbf00;
}

ion-icon.green {
  color: #76c893;
}

ion-item {
  max-height: 64px;
  transition: 0.3s;
  transition-delay: 0.3s;
}

ion-item.message-wrapped {
  z-index: 2;
  --ion-item-background: var(--ion-color-step-100);
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 8px 0px;
  transition: 0.4s !important;
  transition-delay: 0.3s;
  max-height: 70vh !important;
}

ion-item.message-unread {
  --ion-item-background: rgb(var(--ion-color-primary-rgb), 0.1);
}

ion-note {
  line-height: 1.2em !important;
}

ion-col div.btn-div {
  padding: 8px;
  color: #4d97ff;
  text-align: center;
  font-size: 0.85em;
  border-radius: 4px;
  margin: 5px;
  margin-top: 8px;
  background: var(--ion-color-light-tint);
  position: relative;
  overflow: hidden;
}

ion-col .btn-div ion-icon {
  font-size: 20px;
}

ion-col .btn-div ion-badge {
  margin-right: 5px;
}

.item-input.sc-ion-label-md-h,
.item-input .sc-ion-label-md-h {
  max-width: 80%;
}

/*ion-badge {
  position: fixed;
  bottom: -0.2em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5em;
  font-size: 0.8em;
}*/

ion-avatar {
  position: relative;
}

ion-avatar ion-badge {
  border-radius: 100%;
  top: 0;
  position: absolute;
  right: 0;
  height: 10px;
  width: 5px;
}

.details {
  opacity: 0.7;
  font-size: 0.7em;
}

.details span {
  color: rgb(var(--ion-color-primary-rgb));
}
</style>
