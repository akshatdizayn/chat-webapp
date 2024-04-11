"use client";
import { useState, useCallback } from "react";
import { where } from "firebase/firestore";
import Image from "next/image";

import withAuth from "@/hoc/withAuth";
import useAuth from "@/hooks/useAuth";
import { fetchCollection, getDocument } from "@/actions/chat.actions";

import Back from "../icons/Back";

import Illustration from "../icons/Illustration";

import styles from "./Homepage.module.scss";
import { Chat, User } from "@/types/interfaces.types";
import SideDrawer from "@/components/SideDrawer/SideDrawer";
import ChatScreen from "@/components/ChatScreen/ChatScreen";

const Homepage: React.FC = () => {
  const [user] = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const handleChatId = useCallback(
    async (id: string) => {
      if (!user || !user.uid) return;

      let queryCondition: any;
      if (id) {
        queryCondition = where("cid", "==", id);
      } else {
        queryCondition = where("members", "array-contains", user.uid);
      }

      const data = await fetchCollection("chats", queryCondition);
      if (data.length > 0) {
        const chat: Chat = data[0];
        const otherUserId = chat.members.find((id) => id !== user.uid);
        const userData = await getDocument("users", otherUserId);

        setChatId(id);
        setUserData(userData);
      }
    },
    [user]
  );
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
              <ChatScreen cid={chatId} />
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
