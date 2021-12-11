<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="explore" @click="closeModal"></ion-back-button>
        <ion-title>{{ title }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <div class="tw-wrapper">
      <iframe class="tw-player" :src="embed" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>
    </div>
    <div class="chips">
      <ion-chip @click="openAuthor">
        <ion-avatar>
          <img :src="pfp">
        </ion-avatar>
        <ion-label>by {{ author }}</ion-label>
      </ion-chip>
      <ion-chip color="danger" :outline="loveText == 'Love'" @click="love">
        <ion-icon :icon="loveIcon"></ion-icon>
        <ion-label>{{ stats.loves }}</ion-label>
      </ion-chip>
      <ion-chip color="warning" :outline="favText == 'Favorite'" @click="favorite">
        <ion-icon :icon="favIcon"></ion-icon>
        <ion-label>{{ stats.favorites }}</ion-label>
      </ion-chip>
      <ion-chip color="success">
        <ion-icon :icon="sync"></ion-icon>
        <ion-label>{{ stats.remixes }}</ion-label>
      </ion-chip>
      <ion-chip color="primary">
        <ion-icon :icon="eye"></ion-icon>
        <ion-label>{{ stats.views }}</ion-label>
      </ion-chip>
      <ion-chip color="secondary" @click="shareProject">
        <ion-icon :icon="shareSocial"></ion-icon>
        <ion-label>Share</ion-label>
      </ion-chip>
    </div>
    <ion-card class="text-box ion-padding ion-activatable" v-if="remix.parent != null" @click="openRemixed()">
      <ion-card-content>
        <ion-card-title>
          <ion-icon class="fix-icon" :icon="sync" /> Remixed
        </ion-card-title>
        <div>
          This project is a remix of a previous project! Some elements of this project may or may not be property of the author. Click here to visit the original project.
        </div>
      </ion-card-content>
      <ion-ripple-effect />
    </ion-card>
    <ion-card :class="['text-box', 'ion-padding', 'instructions', {'selected': selected == 'instructions'}]" v-if="instructions.length > 1" @click="select('instructions')">
      <ion-card-content>
        <ion-card-title>Instructions</ion-card-title>
        <div v-html="instructions">
        </div>
      </ion-card-content>
      <div class="shadow" v-if="selected != 'instructions'"></div>
    </ion-card>
    <ion-card :class="['text-box', 'ion-padding', 'credits', {'selected': selected == 'credits'}]" v-if="credits.length > 1" @click="select('credits')">
      <ion-card-content>
        <ion-card-title>Credits</ion-card-title>
        <div v-html="credits">
        </div>
      </ion-card-content>
      <div class="shadow" v-if="selected != 'credits'"></div>
    </ion-card>
    <br />
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="exitOutline" @click="openInBrowser"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</ion-page>
</template>

<script>
import '@capacitor-community/http';
import {
  Plugins
} from '@capacitor/core';
import {
  Share
} from '@capacitor/share';
const {
  Http
} = Plugins;
import {
  StatusBar
} from '@capacitor/status-bar';
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
  IonChip,
  IonLabel,
  IonAvatar,
  IonCardContent,
  IonIcon,
  IonRippleEffect
} from '@ionic/vue';
import {
  addOutline,
  exitOutline,
  heartOutline,
  starOutline,
  star,
  heart,
  sync,
  eye,
  shareSocial
} from 'ionicons/icons';
import {
  defineComponent
} from 'vue';
import UserModal from './UserModal.vue';
import {
  Browser
} from '@capacitor/browser';
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
    StatusBar.setBackgroundColor({
      color: '#1f1f1f'
    });
    return {
      session: JSON.parse(window.localStorage.getItem('session')) ? JSON.parse(window.localStorage.getItem('session')) : null,
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
      loveText: 'Love',
      shareSocial,
      stats: {},
      remix: null,
      selected: null,
      heart,
      star,
      sync,
      eye
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
    IonChip,
    IonLabel,
    IonAvatar,
    IonCardContent,
    IonIcon,
    IonRippleEffect
  },
  mounted() {
    console.log(`Session`);
    console.log(this.session);
    this.loadProject();
  },
  methods: {
    async shareProject() {
      await Share.share({
        title: this.title,
        text: 'Check out this Scratch project I found with Itchy!',
        url: `https://scratch.mit.edu/projects/${this.id}`,
        dialogTitle: 'Share this project'
      });
    },
    openRemixed() {
      window.open(`/?project=${this.remix.parent}`);
    },
    closeModal() {
      StatusBar.setBackgroundColor({
        color: '#121212'
      });
      modalController.dismiss();
    },
    select(item) {
      this.selected = item;
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
          this.stats = response.data.stats;
          this.remix = response.data.remix;
          if (this.session) {
            Http.request({
              method: 'POST',
              url: `https://api.scratch.mit.edu/users/${this.author}/projects/${this.id}/views`,
              headers: {
                "x-token": this.session.token
              }
            });
          }
        });
      if (this.session) {
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
      }
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
    async openInBrowser() {
      await Browser.open({
        url: `https://scratch.mit.edu/projects/${this.id}`,
        toolbarColor: "#4E97FF"
      })
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
              this.stats.favorites--;
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
              this.stats.favorites++;
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
        if (response.data.userLove) {
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
              this.stats.loves--;
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
              this.stats.loves++;
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
  color: var(--ion-text-color);
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}

.chips {
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 100vw;
  transform: translateX(-5.5vw);
}

ion-chip:first-of-type {
  margin-left: 7vw;
}

ion-chip:last-of-type {
  margin-right: 5vw;
}

ion-card-content {
  position: relative;
}

.shadow {
  width: 100%;
  height: 30%;
  background: transparent;
  background: linear-gradient(0deg, var(--ion-card-background) 10%, rgba(0, 0, 0, 0) 100%);
  position: absolute;
  bottom: 0;
  left: 0;
}

.instructions,
.credits,
.remixed {
  max-height: 18vh;
  transition: max-height 0.3s ease-out;
}

.instructions.selected {
  max-height: max-content !important;
  transition: max-height 0.3s ease-out;
}

.credits.selected {
  max-height: max-content !important;
  transition: max-height 0.3s ease-out;
}

.fix-icon {
  transform: translateY(2px);
}
</style>
