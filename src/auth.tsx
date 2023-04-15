import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyAi2lc0AJOJe1aLm4vZMTJbIYOAOUN2hBU',
  authDomain: 'btob-330a6.firebaseapp.com',
  projectId: 'btob-330a6',
  storageBucket: 'btob-330a6.appspot.com',
  messagingSenderId: '584879332485',
  appId: '1:584879332485:web:f96fac370a294aca75ddec',
  measurementId: 'G-EZ3TRTB1W6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
