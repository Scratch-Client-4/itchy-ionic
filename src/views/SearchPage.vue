<template>
<ion-page>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Search</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-searchbar id="search" animated="true" autocorrect="on" enterkeyhint="search" inputmode="search" spellcheck="true" @search="search($event, $event.target.value, 0)"></ion-searchbar>
    <ion-item-group v-if="searchData.length > 0">
      <ion-item v-for="(result, i) in searchData" :key="i" :href="result.url">
        <ion-label>{{ result.title }}</ion-label>
      </ion-item>
    </ion-item-group>
    <ion-infinite-scroll @ionInfinite="search($event, searchString, currentOffset)" threshold="100px" id="infinite-scroll">
      <ion-infinite-scroll-content class="ion-padding" loading-spinner="circular" loading-text="Loading more results...">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </ion-content>
</ion-page>
</template>

<script>
// const root = 'https://itchy-api.vercel.app' // 'http://localhost:3000'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  alertController
} from '@ionic/vue';
export default {
  name: 'SearchPage',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSearchbar,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  },
  data() {
    return {
      searchData: [],
      currentOffset: 0,
      searchString: "",
      completedSearch: false
    }
  },
  methods: {
    async search(event, query, offset) {
      if (this.completedSearch) {
        return 0;
      }
      this.searchString = query;
      query = encodeURI(query);
      offset = this.currentOffset;
      // Define the variable to store search result JSON
      let toReturn;
      // Make an awaiting fetch call to our personal CORS proxy but limit the results to ten (the maximum for Qwant)
      await fetch(`https://itchy-api.vercel.app/api/search?q=${query}&offset=${offset}`, {
          mode: 'cors'
        })
        // Once the response has competed
        .then((response) => {
          // Convert the response to JSON
          if (response.status == 429) {
            this.presentAlert('Search Error', '429', 'Please allow a cooldown period for search');
            return 1;
          } else if (!response.ok) {
            this.presentAlert('Unknown Error', response.status, response.statusText);
            return 1;
          }
          return response.json();
          // Once the response has been converted
        }).then((data) => {
          console.log(data);
          // Set toReturn equal to the returned data
          data.forEach((item) => {
            let matchesRegex = this.matchRegexes(item.url);
            if (matchesRegex) {
              item.url = `/tabs/tab1?${matchesRegex.type}=${matchesRegex.id}`
              this.searchData.push(item);
            }
          });
          console.log(data);
          if (data.length < 10) {
            this.completedSearch = true;
          }
          this.currentOffset += this.searchData.length;
          event.target.complete();
        });
      // Return the toReturn variable
      return toReturn;
    },
    matchRegexes(string) {
      let numberPattern = new RegExp(`\\d+`, `g`);
      let projectRegex = new RegExp(`.(\\/scratch.mit.edu/projects/)[0-9]\\d*`, `g`);
      let studioRegex = new RegExp(`.(\\/scratch.mit.edu/studios/)[0-9]\\d*`, `g`);
      if (string.match(projectRegex)) {
        console.log(`${string} is a link to a project`);
        let id = string.match(projectRegex)[0].match(numberPattern)[0];
        return {
          type: "project",
          id: id
        };
      } else if (studioRegex.test(string)) {
        console.log(`${string} is a link to a studio`);
        return {
          type: "studio",
          id: 123456
        };
      } else {
        return null;
      }
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
    }
  }
}
</script>
