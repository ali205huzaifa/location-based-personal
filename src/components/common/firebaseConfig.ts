import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCSqxyesFoq1znF1LxHA_2nSiT_0xg86SM",
  authDomain: "housing-platform.firebaseapp.com",
  projectId: "housing-platform",
  storageBucket: "housing-platform.appspot.com",
  messagingSenderId: "843938039071",
  appId: "1:843938039071:web:9c0677d7105dd84f0c9c2a",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const vapidKey =
  "BLLrNowxIEpJYWuGpFPOqdwrdbLRiPnQyRcdCtbHNr3e55F4R5CKvaAl6FmV2AwDsRJlM0ViQK5NE0dLhNndHbM";

let tokenRequested = false;

export const requestFCMToken = async () => {
  if (tokenRequested) {
    console.warn("FCM token already requested");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    tokenRequested = true;
    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export { messaging, onMessage };
