"use client";
import { useState, useCallback } from "react";
import Image from "next/image";

import withAuth from "@/hoc/withAuth";
import { getDocument } from "@/actions/chat.actions";

import Back from "../icons/Back";
import ChatScreen from "../../components/ChatScreen/ChatScreen";
import SideDrawer from "@/components/SideDrawer/SideDrawer";

import chatBackground from "@/public/chatBackground.png";
import Illustration from "../icons/Illustration";

import styles from "./Homepage.module.scss";

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [chatId, setChatId] = useState(null);

  const handleChatId = useCallback(async (id) => {
    const userData = await getDocument("users", id);
    setChatId(id);
    setUserData(userData);
  }, []);

  return (
    <div className={styles.Homepage}>
      <div className={styles.sideDrawer}>
        <SideDrawer onChatIdChange={handleChatId} />
      </div>
      <div className={styles.rightContainer}>
        {userData ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.back} onClick={() => setUserData(null)}>
                <Back />
              </div>
              <div className={styles.userImage}>
                <Image
                  className={styles.image}
                  src={userData.photoURL}
                  alt={userData.displayName}
                  width={50}
                  height={50}
                />
              </div>
              <p className={styles.userName}>{userData.displayName}</p>
            </div>
            <div className={styles.chatContainer}>
              <ChatScreen cid={chatId} chatData={userData} />
            </div>
          </>
        ) : (
          <div className={styles.noChat}>
            <Illustration />
            <p className={styles.text}>Click on a chat to start messaging</p>
            <p className={styles.text}>
              Or
              <br /> Create a new chat
            </p>
          </div>
        )}
        {/* <div className={styles.chatBackground}>
          <Image priority src={chatBackground} alt="Chat background" />
        </div> */}
      </div>
    </div>
  );
};

export default withAuth(Homepage);
