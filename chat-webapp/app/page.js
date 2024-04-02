"use client";

import { handleGoogleSignIn } from "@/actions/user.actions";
import withAuth from "@/hoc/withAuth";

import styles from "./page.module.css";

const LoginPage = () => {
  return (
    <div className={styles.LoginPage}>
      <h1>Login Page</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};
export default withAuth(LoginPage, true);
