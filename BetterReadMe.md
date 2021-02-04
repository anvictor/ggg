<!-- Let’s start. -->

npx create-react-app my-app –typescript

<!-- npx acts like your globally installed command. Meaning you don’t need to run npm i -g create-react-app just to build your React starter app. NPX is installed by default in NPM v5.2.0 -->

cd my-app

npm install typescript

<!-- change .js to .ts or .tsx -->

npm i mobx mobx-react mobx-react-router axios react-router-dom jwt-decode

<!-- this install mobx library, a react-router for mobx app, axios for fetching data, and jwt-decode for decoding a JWT token. You can go to https://www.npmjs.com/ and search each library to know more about them. -->

npm i @types/react-router-dom @types/axios @types/jwt-decode

<!-- rename .js to .ts or .tsx if DOM tags is inside it -->

<!-- Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i @types/jest` or `npm i @types/mocha`.ts(2582) -->

npm i @types/jest

<!-- this installs the @types of react-router-dom, axios, and jwt-decode. Take note, you need to install these @types in your app’s dependencies, not in your app’s devDependencies -->

npm i @types/node

npm i @types/react

<!-- Even though the 2 @types above are already installed, React complaints that they are not installed. So just reinstall it to avoid any TS2699 error
run npm start to see if your app will compile without any problems. -->


<!-- run npm start to see if your app will compile without any problems. -->

npm start

<!-- Now let’s add DevTools for Mobx -->

npm i -D mobx-react-devtools

<!-- in App.tsx add -->

import DevTools from ‘mobx-react-devtools

<!-- run the npm start again to see if your app runs without any problem. It should look like this. -->

Ctrl+c, Ctrl+c, 
npm start

<!-- Lastly, let’s make your app SCSS ready. -->

npm i node-sass

<!-- After installing node-sass, edit all css files, any reference to your importing files to scss. Run it again to see if it’s running fine. -->

Ctrl+c, Ctrl+v, 
npm start

<!-- install -->
yarn add node-sass
<!-- Rename all .css to .scss -->

<!-- Install 'msal' -->
npm install msal

<!-- Install 'firebase' -->
npm install firebase

<!-- FirebaseUI for Web — Auth -->
npm install firebaseui --save