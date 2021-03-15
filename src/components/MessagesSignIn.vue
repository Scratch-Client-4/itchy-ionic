<template>
<div id="container">
  <strong>Messages</strong>
  <p>Itchy can link to your Scratch account and let you view messages!</p>
  <ion-button @click="openAuthWindow">Sign In</ion-button>
</div>
</template>

<script>
import {
  IonButton,
  modalController
} from '@ionic/vue';
import AuthModal from './AuthModal.vue';
export default {
  name: 'MessagesSignIn',
  components: {
    IonButton
  },
  props: {
    name: String,
    message: String
  },
  methods: {
    async openAuthWindow() {
      const modal = await modalController
        .create({
          component: AuthModal,
          cssClass: 'open-modal',
          componentProps: {
            mode: 'Login'
          }
        })
      return modal.present();
    },
  }
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
  padding: 0.5em 2em;
}

#container a {
  text-decoration: none;
}
</style>
