"use client";
import { useState, useCallback } from "react";
import Image from "next/image";

import withAuth from "@/hoc/withAuth";
import { fetchCollection, getDocument } from "@/actions/chat.actions";

import Back from "../icons/Back";
import ChatScreen from "../../components/ChatScreen/ChatScreen";
import SideDrawer from "@/components/SideDrawer/SideDrawer";

import chatBackground from "@/public/chatBackground.png";
import Illustration from "../icons/Illustration";

import styles from "./Homepage.module.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import { db } from "@/firebase";

const Homepage = () => {
  const [user] = useAuth();
  const [userData, setUserData] = useState(null);
  console.log("userData", userData);
  const [chatId, setChatId] = useState(null);
  console.log("chatId", chatId);

  const handleChatId = useCallback(
    async (id) => {
      // id is chatId of the chat
      //in chats document there is a field called members which is an array of user ids
      // from which we can get the userData of the user which is not the current user
      if (user.uid === null) return;
      const queryCondition = where("cid", "==", id);

      // const collectionRef = collection(db, "chats");
      // const q = query(collectionRef, queryCondition);
      // const data = await getDocs(q);
      // const chatData = data.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // debugger;
      const data = await fetchCollection("chats", queryCondition);
      const chat = data[0];
      const otherUserId = chat.members.find((id) => id !== user.uid);
      const userData = await getDocument("users", otherUserId);

      setChatId(id);
      setUserData(userData);
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
              <ChatScreen
                cid={chatId}
                //  chatData={userData}
              />
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
