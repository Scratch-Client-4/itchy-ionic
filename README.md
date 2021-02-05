# itchy-ionic

A more native approach to a Scratch mobile app built with the Ionic framework

<img src="docs/Screenshot_latest.png" alt="screenshot of Itchy" width="300px">

## Developing
### Prerequisites
- `itchy-ionic` is built with Ionic Vue, which means you'll need to understand [Ionic](https://ionicframework.com/docs/vue/overview) and [Vue.js](https://vuejs.org) as well as [Capacitor](https://capacitorjs.com/) if you're building the app for Android.  

### Process
Before adding new features, check the [issues page](https://github.com/scratch-client-4/itchy-ionic) to make sure there are no issues you can fix.  While developing new features and/or components, please make sure that your code is as modularized and is as reusable as possible.  

## Building for platforms
### Requirements
- A properly set-up installation of [Android Studio](https://developer.android.com/studio)
- [Git](https://git-scm.com/)
- [NPM](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/)

### Building for android
First, clone the repository:
`git clone https://github.com/Scratch-Client-4/itchy-ionic.git`
Then go into it and install all dependencies:
```
cd itchy-ionic
npm install
```
Then run the build script:
```
npm run production
```
To run on an emulator, press the "Play" icon in the top toolbar or use `Shift+F10`. 

To build APK's for production, open the "Build" menu, hover over "Build Bundle(s) / APK(s)", and select "Build APK(s)".
