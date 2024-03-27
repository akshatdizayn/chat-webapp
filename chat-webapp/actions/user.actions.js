import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
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
