<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button default-href="tab4" @click="closeModal"></ion-back-button>
        <ion-title>{{ mode }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modaled ion-padding">
    <ion-card class="text-box ion-padding">
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col style="text-align:center;">
              <ion-icon :icon="personCircleOutline" style="font-size: 5em;color: var(---ion-color-primary-tint)"></ion-icon>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-item>
          <ion-label position="floating">Username</ion-label>
          <ion-input type="text" v-model="username"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" v-model="password"></ion-input>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col style="text-align:center;">
              <ion-button size="medium" expand="block" @click="logIn">
                <ion-icon :icon="lockClosed" style="font-size:15px;padding-right:10px;"></ion-icon>Sign In
              </ion-button>
              <span style="font-size:11px;margin-top:10px;">Your data will be securely sent to our servers.</span>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
</ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonLabel,
  IonInput,
  IonItem,
  modalController,
  alertController,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
import {
  lockClosed,
  personCircleOutline
} from 'ionicons/icons';
import {
  defineComponent
} from 'vue'
export default defineComponent({
  name: 'AuthModal',
  props: {
    mode: {
      type: String,
      default: 'Login'
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonLabel,
    IonInput,
    IonItem,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol
  },
  setup() {
    return {
      lockClosed,
      personCircleOutline
    }
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    async presentAlert(title, code, message) {
      const alert = await alertController
        .create({
          header: title,
          subHeader: code,
          message: message,
          buttons: ['OK']
        });
      return alert.present();
    },
    async logIn() {
      const username = this.username;
      const password = this.password;
      const response = await fetch("https://itchy-api.vercel.app/api/auth", {
        body: JSON.stringify({
          "username": username,
          "password": password
        }),
        method: "POST"
      })
      let json = await response.json();
      if (response.status == 200) {
        window.localStorage.setItem("session", JSON.stringify(json));
        window.location.reload();
      } else {
        this.presentAlert('Error', response.status + ' ' + response.statusText, 'Could not log you in.  Please try again.')
      }
    }
  }
});
</script>
