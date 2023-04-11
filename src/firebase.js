import firebase from "firebase";
let config = {
  apiKey: "AIzaSyBm5pZi0jxgpLKnkNvHQ8KXUrR6RftVehI",
  authDomain: "jagota-prod-live-location.firebaseapp.com",
  databaseURL:
    "https://jagota-prod-live-location-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jagota-prod-live-location",
  storageBucket: "jagota-prod-live-location.appspot.com",
  messagingSenderId: "277495975477",
  appId: "1:277495975477:web:38865407cf741f4ec6eb7c",
};
firebase.initializeApp(config);
var database = firebase.database();

export default database;
