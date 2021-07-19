<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="explore" @click="closeModal"></ion-back-button>
        <ion-title>{{ title }} :D</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <div class="tw-wrapper">
      <iframe class="tw-player" :src="embed" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>
    </div>
    <ion-card class="text-box ion-activatable ripple-parent">
      <ion-card-content class="author-box" @click="openAuthor">
        <img :src="pfp" class="author-pfp"><span class="author-name">by {{ author }}</span>
      </ion-card-content>
      <ion-ripple-effect></ion-ripple-effect>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="instructions.length > 1">
      <ion-card-content>
        <ion-card-title>Instructions</ion-card-title>
        <div v-html="instructions">
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card class="text-box ion-padding" v-if="credits.length > 1">
      <ion-card-content>
        <ion-card-title>Credits</ion-card-title>
        <div v-html="credits">
        </div>
      </ion-card-content>
    </ion-card>
    <br />
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button @click="openInBrowser" data-desc="Open in Browser">
          <ion-icon :icon="exitOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="favorite" :data-desc="favText">
          <ion-icon :icon="favIcon"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="love" :data-desc="loveText">
          <ion-icon :icon="loveIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-content>
</ion-page>
</template>

<script>
import '@capacitor-community/http';
import {
  Plugins
} from '@capacitor/core';
const {
  Http
} = Plugins;
const utils = require('../utils.js');
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  modalController,
  IonCard,
  IonCardContent,
  IonRippleEffect,
  IonIcon
} from '@ionic/vue';
import {
  addOutline,
  exitOutline,
  heartOutline,
  starOutline,
  star,
  heart
} from 'ionicons/icons';
import {
  defineComponent
} from 'vue';
import UserModal from './UserModal.vue';
export default defineComponent({
  name: 'ProjectModal',
  props: {
    embed: {
      type: String,
      default: 'https://turbowarp.org/embed.html'
    },
    id: Number
  },
  data() {
    return {
      session: JSON.parse(window.localStorage.getItem('session')) ? JSON.parse(window.localStorage.getItem('session'))[0] : null,
      title: 'loading...',
      author: '',
      content: '',
      instructions: 'loading...',
      credits: '',
      pfp: 'https://u.cubeupload.com/darkness3560/newscratchavataropti.png',
      addOutline,
      exitOutline,
      favIcon: starOutline,
      favText: 'Favorite',
      loveIcon: heartOutline,
      loveText: 'Love'
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonRippleEffect,
    IonIcon
  },
  mounted() {
    console.log(`Session`);
    console.log(this.session);
    this.loadProject();
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    loadProject() {
      Http.request({
          method: 'GET',
          url: `https://api.scratch.mit.edu/projects/${this.id}`
        })
        .then((response) => {
          this.instructions = utils.prepareText(response.data.instructions);
          this.credits = utils.prepareText(response.data.description);
          this.pfp = response.data.author.profile.images["90x90"];
          this.title = response.data.title;
          this.author = response.data.author.username;
        });
      Http.request({
        method: 'GET',
        url: `https://api.scratch.mit.edu/projects/${this.id}/favorites/user/${this.session.username}`,
        headers: {
          "x-token": this.session.token
        }
      }).then((response) => {
        if (response.data.userFavorite) {
          this.favIcon = star;
          this.favText = 'Unfavorite';
        }
      });
      Http.request({
        method: 'GET',
        url: `https://api.scratch.mit.edu/projects/${this.id}/loves/user/${this.session.username}`,
        headers: {
          "x-token": this.session.token
        }
      }).then((response) => {
        if (response.data.userLove) {
          this.loveIcon = heart;
          this.loveText = 'Unlove';
        }
      });
    },
    async openAuthor() {
      const modal = await modalController
        .create({
          component: UserModal,
          cssClass: 'open-modal',
          componentProps: {
            username: this.author
          },
        })
      this.closeModal();
      return modal.present();
    },
    openInBrowser() {
      window.open(`https://scratch.mit.edu/projects/${this.id}`);
    },
    favorite() {
      Http.request({
        method: 'GET',
        url: `https://api.scratch.mit.edu/projects/${this.id}/favorites/user/${this.session.username}`,
        headers: {
          "x-token": this.session.token
        }
      }).then((response) => {
        if (response.data.userFavorite) {
          Http.request({
            method: 'DELETE',
            url: `https://api.scratch.mit.edu/projects/${this.id}/favorites/user/${this.session.username}`,
            headers: {
              "x-token": this.session.token
            }
          }).then((res) => {
            if (res.status == 200) {
              this.favIcon = starOutline;
              this.favText = 'Favorite';
            }
          })
        } else {
          Http.request({
            method: 'POST',
            url: `https://api.scratch.mit.edu/projects/${this.id}/favorites/user/${this.session.username}`,
            headers: {
              "x-token": this.session.token
            }
          }).then((res) => {
            if (res.status == 200) {
              this.favIcon = star;
              this.favText = 'Unfavorite';
            }
          });
        }
      });
    },
    love() {
      Http.request({
        method: 'GET',
        url: `https://api.scratch.mit.edu/projects/${this.id}/loves/user/${this.session.username}`,
        headers: {
          "x-token": this.session.token
        }
      }).then((response) => {
        if (response.data.userFavorite) {
          Http.request({
            method: 'DELETE',
            url: `https://api.scratch.mit.edu/projects/${this.id}/loves/user/${this.session.username}`,
            headers: {
              "x-token": this.session.token
            }
          }).then((res) => {
            if (res.status == 200) {
              this.loveIcon = heartOutline;
              this.loveText = 'Love';
            }
          });
        } else {
          Http.request({
            method: 'POST',
            url: `https://api.scratch.mit.edu/projects/${this.id}/loves/user/${this.session.username}`,
            headers: {
              "x-token": this.session.token
            }
          }).then((res) => {
            if (res.status == 200) {
              this.loveIcon = heart;
              this.loveText = 'Unlove';
            }
          });
        }
      });
    }
  }
});
</script>
<style scoped>
ion-fab {
  transform: translateY(-56px);
}

ion-fab-button[data-desc] {
  position: relative;
}

ion-fab-button[data-desc]::after {
  position: absolute;
  content: attr(data-desc);
  z-index: 1;
  right: 55px;
  bottom: 4px;
  background-color: var(--ion-color-light);
  padding: 9px;
  border-radius: 5px;
  color: white;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}
</style>
