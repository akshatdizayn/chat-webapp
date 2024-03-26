"use client";

import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const Login = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    console.log(provider, "provider");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user, "user");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Login;
