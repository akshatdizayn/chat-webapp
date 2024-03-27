import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export const handleGoogleSignIn = async (router) => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User:", result.user);
        router.push("/homepage");
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const handleGoogleSignout = async (router) => {
  try {
    await signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Google Sign-Out Error:", error);
      });
  } catch (error) {
    console.error("Google Sign-Out Error:", error);
  }
};
