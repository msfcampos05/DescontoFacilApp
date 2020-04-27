import * as firebase from 'firebase';

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";

// Initialize Firebase

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBqQvrQALBMEvFsIySnMNCmavLXu3RA9WM",
    authDomain: "descontofacilapp-ca0e7.firebaseapp.com",
    databaseURL: "https://descontofacilapp-ca0e7.firebaseio.com",
    projectId: "descontofacilapp-ca0e7",
    storageBucket: "descontofacilapp-ca0e7.appspot.com",
    messagingSenderId: "467956470595",
    appId: "1:467956470595:web:3233efd5114cec398515f6",
    measurementId: "G-W1L39P5NGW"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
