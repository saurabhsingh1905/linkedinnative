import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCFjo_jxhor0YR45WAe8vbOvbXVGkLbLmg",
  authDomain: "linkedinnative.firebaseapp.com",
  projectId: "linkedinnative",
  storageBucket: "linkedinnative.appspot.com",
  messagingSenderId: "312323180818",
  appId: "1:312323180818:web:a91fd93ee7586389a78bcb"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase};