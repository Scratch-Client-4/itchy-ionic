# itchy-ionic

A more native approach to a Scratch mobile app

<img src="docs/Screenshot_latest.png" alt="screenshot of Itchy" width="300px">

## Developing
### Prerequisites
- `itchy-ionic` is built with Ionic Vue, which means you'll need to understand [Ionic](https://ionicframework.com/docs/vue/overview) and [Vue.js](https://vuejs.org) as well as [Capacitor](https://capacitorjs.com/) if you're building the app for Android.  

### Process
Before adding new features, check the [issues page](https://github.com/scratch-client-4/itchy-ionic) to make sure there are no issues you can fix.  While developing new features and/or components, please make sure that your code is as modularized and reusable as possible.  

## Building
### Prerequisites
- A properly set-up installation of [Android Studio](https://developer.android.com/studio)
- [Git](https://git-scm.com/)
- [NPM](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/)

### Steps
Start by `git clone`-ing the repository to your computer or virtual machine.  Once the repository has successfully downloaded, `cd` into the folder and run `npm install` to get all dependencies.  This may take a while.  After the installation has completed, run `npm run production` to build the app's files and open it in Android Studio.  To run on an emulator, press the "Play" icon in the top toolbar or use `Shift+F10`.  To build APK's for production, open the "Build" menu, hover over "Build Bundle(s) / APK(s)", and select "Build APK(s)".
