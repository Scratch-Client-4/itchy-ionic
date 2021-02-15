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
<details>
  
  
  ###<summary>Windows Build</summary>
  
  
  
  If you're on Windows, you should get a few errors:
  ![image](https://user-images.githubusercontent.com/36968271/107888864-f7a1e000-6f06-11eb-93fd-480e1027ada3.png)
  This is normal, to fix the errors, replace your *package.json* with this:
  <details>
  <summary>package.json</summary>
  
  ```
  {
  "name": "itchy-ionic",
  "version": "0.5.0",
  "private": true,
  "scripts": {
    "serve": "npx vue-cli-service serve",
    "build": "npx vue-cli-service build",
    "ionic:build": "npx vue-cli-service build",
    "ionic:serve": "npx vue-cli-service serve",
    "test:unit": "npx vue-cli-service test:unit",
    "test:e2e": "npx vue-cli-service test:e2e",
    "lint": "npx vue-cli-service lint",
    "production": "npx vue-cli-service build && npx cap copy && ionic capacitor update && npx cap open android",
    "genDarkSplashes": "npx cordova-res android --skip-config --splash-source ./resources/android/splash-night.jpg --type splash --resources ./resources/android/splash && mv ./resources/android/splash/android/splash/* ./resources/android/splash/night && rmdir ./resources/android/splash/android/splash && rmdir ./resources/android/splash/android && cordova-res android --skip-config --copy",
    "genIcons": "npx cordova-res android --icon-background-source '#15a3ff' --copy"
  },
  "dependencies": {
    "@capacitor/android": "^2.4.6",
    "@capacitor/core": "2.4.6",
    "@ionic-native/web-intent": "^5.31.1",
    "@ionic/vue": "^5.4.0",
    "@ionic/vue-router": "^5.4.0",
    "axios": "^0.21.1",
    "capacitor-dark-mode": "^1.0.5",
    "com-darryncampbell-cordova-plugin-intent": "^2.0.0",
    "cordova-webintent": "github:cordova-misc/cordova-webintent",
    "core-js": "^3.6.5",
    "vue": "^3.0.5",
    "vue-async-computed": "^3.9.0",
    "vue-router": "^4.0.0-0"
  },
  "devDependencies": {
    "@capacitor/cli": "2.4.6",
    "@ionic/lab": "3.2.10",
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-e2e-cypress": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-plugin-router": "~4.5.0",
    "@vue/cli-plugin-unit-jest": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/compiler-sfc": "^3.0.0-0",
    "@vue/test-utils": "^2.0.0-0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^7.0.0-0",
    "vue-jest": "^5.0.0-0"
  },
  "description": "A mobile client for Scratch"
}

  ```
  </details>
  
</details>

To run on an emulator, press the "Play" icon in the top toolbar or use `Shift+F10`.

To build APK's for production, open the "Build" menu, hover over "Build Bundle(s) / APK(s)", and select "Build APK(s)".

## Building assets
As a mobile app, there are several assets that are required to be built for  different screen sizes.  All asset builds use `cordova-res`, which you can install with:

```bash
npm install -g cordova-res
```

### Generating icons
Itchy uses the new standard of [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive), which means that any icon updates must:

- Be high-resolution
- Be made up of foreground and background components
- Fit the size limits of adaptive icons outlined in the [requirements](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)

Building icons is as simple as this:
```bash
cordova-res --type adaptive-icon
cordova-res --type icon
```

The icons are placed in `./resources/android/icon` where they can be referenced by the `config.xml` file.

### Generating splash screens
The splash screen displays when the app is opened but still loading.  It must be simple and also follow the [Cordova splashscreen guidelines](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/).  Splash generation is slightly tricky since we have to build for both light and dark mode.  Light mode is easy enough:

```bash
cordova-res --type splash
```

However, dark mode is not explicitly supported by `cordova-res`, so the team created a custom build script for dark splashes, which **must** be run from the root of the project:

```bash
npm run-script genDarkSplashes
```

Take note that this script is _only designed for Unix-based operating systems_ such as Mac and Linux.  The [forward slashes will break the script on Windows](https://www.howtogeek.com/181774/why-windows-uses-backslashes-and-everything-else-uses-forward-slashes/).  The easiest way to get around this when trying to build on Windows is to temporarily replace the forward slashes (`/`) with escaped backslashes (`\\`).
