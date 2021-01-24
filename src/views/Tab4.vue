<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-title class="ion-padding">Settings</ion-title>
    <ion-item-group>
      <ion-item-divider>
        <ion-label>
          Account
        </ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-label v-if="user.signedIn">
          Signed in as {{ user.name }}
        </ion-label>
        <ion-label v-else>
          Signed out
        </ion-label>
        <ion-button v-if="user.signedIn">Sign Out</ion-button>
        <ion-button v-else>Sign In</ion-button>
      </ion-item>
      <ion-item-divider>
        <ion-label>
          Display
        </ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-label>
          Force dark theme
        </ion-label>
        <ion-toggle></ion-toggle>
      </ion-item>
    </ion-item-group>
  </ion-content>
</ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonItemDivider,
  IonButton
} from '@ionic/vue';
export default {
  name: 'Tab4',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonItemDivider,
    IonButton
  },
  data() {
    return {
      user: {
        signedIn: false,
        name: "-Archon-"
      }
    }
  }
}
</script>
