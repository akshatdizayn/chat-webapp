import { auth, db } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const data = await signInWithPopup(auth, provider);
    const { uid } = data.user;
    console.log(data.user, "data.user");
    const docRef = doc(db, "users", uid);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid,
        email: data.user.email,
        displayName: data.user.displayName,
        photoURL: data.user.photoURL,
        createdAt: data.user.metadata.creationTime,
        lastUpdatedAt: data.user.metadata.lastSignInTime,
      });
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const handleGoogleSignout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google Sign-Out Error:", error);
  }
};
