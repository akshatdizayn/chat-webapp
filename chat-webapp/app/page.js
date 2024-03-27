"use client";

import { useEffect } from "react";

import { handleGoogleSignIn } from "@/actions/user.actions";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("User:", user);
      if (user) {
        router.push("/homepage");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => handleGoogleSignIn(router)}>
        Sign in with Google
      </button>
    </div>
  );
}
