import { auth, db } from "@/firebase";
import { User } from "@/types/interfaces.types";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const handleGoogleSignIn = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {
    const data = await signInWithPopup(auth, provider);
    const { uid } = data.user;
    const docRef = doc(db, "users", uid);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const userData: User = {
        uid,
        email: data.user.email,
        displayName: data.user.displayName,
        photoURL: data.user.photoURL,
        createdAt: data.user.metadata.creationTime,
        lastUpdatedAt: data.user.metadata.lastSignInTime,
        bio: "Hey there! I am using Chatify.",
      };
      await setDoc(docRef, userData);
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const handleGoogleSignout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google Sign-Out Error:", error);
  }
};
