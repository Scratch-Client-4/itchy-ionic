<template>
  <ion-content>
    <ion-list>
      <ion-item button @click="dismiss('system')">System</ion-item>
      <ion-item button @click="dismiss('dark')">Dark</ion-item>
      <ion-item button @click="dismiss('light')">Light</ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, popoverController } from "@ionic/vue";
export default {
  name: "DarkModeToggle",
  components: {
    IonContent,
  },
  data() {
    return {
      dismiss: popoverController.dismiss,
    };
  },
};
</script>

<style scoped>
ion-item {
  text-align: center;
}

ion-item button {
  text-align: center;
}
</style>