"use client";
import Image from "next/image";
import withAuth from "@/hoc/withAuth";
import SideDrawer from "@/components/SideDrawer/SideDrawer";
import chatBackground from "@/public/chatBackground.png";
import styles from "./Homepage.module.scss";
import Illustration from "../icons/Illustration";
// import { handleGoogleSignout } from "@/actions/user.actions";

const Homepage = () => {
  return (
    <div className={styles.Homepage}>
      <div className={styles.sideDrawer}>
        <SideDrawer />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.chatBackground}>
          <Image priority src={chatBackground} alt="Chat background" />
        </div>
        <div className={styles.noChat}>
          <Illustration />
          <p className={styles.text}>Click on a chat to start messaging</p>
          <p className={styles.text}>
            Or
            <br /> Create a new chat
          </p>
        </div>
      </div>
      {/* <button onClick={handleGoogleSignout}>Sign out</button> */}
    </div>
  );
};

export default withAuth(Homepage);
