// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcKQRf-l-AwIKUhBQ06octw7pbu6RESrI",
  authDomain: "amazing-race-oslo.firebaseapp.com",
  databaseURL:
    "https://amazing-race-oslo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "amazing-race-oslo",
  storageBucket: "amazing-race-oslo.appspot.com",
  messagingSenderId: "795461932219",
  appId: "1:795461932219:web:fd08f25d5194341bb6c59e",
  measurementId: "G-CMP440CWSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//const analytics = getAnalytics(app);
