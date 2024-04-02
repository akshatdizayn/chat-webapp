import React, { useEffect, useState } from "react";
import Image from "next/image";

import useAuth from "@/hooks/useAuth";
import {
  addDocument,
  fetchCollection,
  getDocument,
  updateDocument,
} from "@/actions/chat.actions";
import { handleGoogleSignout } from "@/actions/user.actions";
import { timestampConverter } from "@/generalHelpers";

import Add from "@/app/icons/Add";
import Back from "@/app/icons/Back";

import styles from "./SideDrawer.module.scss";

const SideDrawer = () => {
  const [user] = useAuth();

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [singleChatData, setSingleChatData] = useState([]);

  const fetchUsers = async () => {
    const userData = await fetchCollection("users");
    setUsers(userData);
  };

  const fetchChats = async () => {
    const allChatData = await fetchCollection("chats");
    return Promise.all(
      allChatData.map(async (chat) => {
        const user = await getDocument("users", chat.members[0]);
        return { ...user, chatData: chat };
      })
    );
  };

  const addChat = async (chatData) => {
    const docRef = await addDocument("chats", chatData);
    return docRef;
  };

  const handleAdd = async () => {
    setShowUsers(true);
    await fetchUsers();
  };

  const handleBack = () => {
    setShowUsers(false);
  };

  const handleAddAndFetchChatData = async (uid) => {
    if (!uid) return;

    const existingChat = singleChatData.find((chat) =>
      chat.chatData.members.includes(uid)
    );
    if (existingChat) {
      console.log("Chat already exists");
      setShowUsers(false);
      return;
    }

    const chatData = {
      createdAt: new Date(),
      lastMessage: "Hello there!",
      members: [uid, user.uid],
      updatedAt: new Date(),
      unreadCount: 0,
    };
    const chatId = await addChat(chatData);
    await updateDocument("chats", chatId, { cid: chatId });

    const chatDataWithUser = await fetchChats();
    setSingleChatData(chatDataWithUser);
    setShowUsers(false);
  };

  useEffect(() => {
    const fetchInitialChatData = async () => {
      const chatDataWithUser = await fetchChats();
      setSingleChatData(chatDataWithUser);
    };

    fetchInitialChatData();
  }, []);

  return (
    <div className={styles.SideDrawer}>
      <div className={styles.header}>
        {showUsers ? (
          <div className={styles.headerDetails}>
            <div className={styles.back} onClick={handleBack}>
              <Back />
            </div>
            <p className={styles.text}>Select Chat</p>
          </div>
        ) : (
          <>
            <p className={styles.text1}>Chats</p>
            <p className={styles.text1} onClick={handleGoogleSignout}>
              Sign out
            </p>
          </>
        )}
      </div>
      <div className={styles.container}>
        {showUsers ? (
          users.map((item) => (
            <div
              className={styles.singleUser}
              key={item.uid}
              onClick={() => handleAddAndFetchChatData(item.uid)}
            >
              <div className={styles.avatar}>
                <Image
                  src={item.photoURL}
                  alt="avatar"
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.content}>
                <p className={styles.name}>{item.displayName}</p>
                <p className={styles.bio}>
                  {item.bio ? item.bio : "Hey there! I am using Chatify."}
                </p>
              </div>
            </div>
          ))
        ) : singleChatData.length > 0 ? (
          singleChatData.map((item, index) => (
            <div key={index} className={styles.singleChat}>
              <div className={styles.avatar}>
                <Image
                  src={item.photoURL}
                  alt="avatar"
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.content}>
                <p className={styles.title}>{item.displayName}</p>
                <p className={styles.desc}>{item?.chatData?.lastMessage}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.time}>
                  {timestampConverter(item?.chatData?.updatedAt)}
                </p>
                {item.chatData?.unreadCount > 0 && (
                  <div className={styles.badge}>
                    {item?.chatData?.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No Chats</div>
        )}
        <div className={styles.addButton} onClick={handleAdd}>
          <Add />
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
