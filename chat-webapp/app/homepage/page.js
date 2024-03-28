"use client";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "@/firebase";

import withAuth from "@/hoc/withAuth";
// import useAuth from "@/hooks/useAuth";

import { handleGoogleSignout } from "@/actions/user.actions";

import styles from "./Homepage.module.scss";
import SideDrawer from "@/components/SideDrawer/SideDrawer";

const Homepage = () => {
  return (
    <div className={styles.Homepage}>
      <div className={styles.sideDrawer}>
        <SideDrawer />
      </div>
      <div className={styles.rightContainer}></div>
      {/* <button onClick={handleGoogleSignout}>Sign out</button> */}
    </div>
  );
};

export default withAuth(Homepage);
