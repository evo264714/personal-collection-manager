import { initializeApp } from "firebase/app";
import { getAuth, onIdTokenChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChLb3Om9Dt2HzoAXz_ac0ECRsO4qwyQI0",
  authDomain: "personal-collection-manager.firebaseapp.com",
  projectId: "personal-collection-manager",
  storageBucket: "personal-collection-manager.appspot.com",
  messagingSenderId: "88176798286",
  appId: "1:88176798286:web:ce81e41d7d430007edb11f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const monitorAuthState = () => {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken(true);
    }
  });
};

export { auth, monitorAuthState };
