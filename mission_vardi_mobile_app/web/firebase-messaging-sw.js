// This file is required for Firebase Cloud Messaging in Flutter Web
// If you want to receive background notifications on the web, you'll need to add your 
// Firebase config here inside firebase.initializeApp()
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

const firebaseConfig = {
  // You can leave these blank if you only use mobile push notifications, 
  // but the file must exist so the browser doesn't crash on startup!
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
