import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCAlt0ELo-7ToVtETTmq8UstYl73CyT1vg",
  authDomain: "farmwise-25fa5.firebaseapp.com",
  databaseURL: "https://farmwise-25fa5-default-rtdb.firebaseio.com",
  projectId: "farmwise-25fa5",
  storageBucket:"farmwise-25fa5.appspot.com",
  messagingSenderId: "783183340954",
  appId: "1:783183340954:web:abdfee5d9b93b07b1c8623",
  measurementId: "G-78JRJEDBV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
async function uploadProfileImage(file: File, userId: string) {
  try {
   const storageRef = ref(storage, `profile_images/${userId}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Image upload failed:", error);
  }
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { uploadProfileImage };

export default app;