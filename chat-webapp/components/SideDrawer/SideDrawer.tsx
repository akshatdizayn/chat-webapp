import React, { useEffect, useState } from "react";
import Image from "next/image";
import { collection, onSnapshot, where } from "firebase/firestore";

import useAuth from "@/hooks/useAuth";
import { db } from "@/firebase";
import {
  addDocument,
  fetchCollection,
  getDocument,
  updateDocument,
} from "@/actions/chat.actions";
import { handleGoogleSignout } from "@/actions/user.actions";
import { timestampConverter } from "@/generalHelpers";

import NewChat from "@/app/icons/NewChat";
import Back from "@/app/icons/Back";

import styles from "./SideDrawer.module.scss";
import { Chat, User } from "@/types/interfaces.types";

interface Props {
  onChatIdChange: (id: string) => void;
}

const SideDrawer: React.FC<Props> = ({ onChatIdChange }) => {
  const [user] = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [singleChatData, setSingleChatData] = useState<
    (User & { chatData: Chat })[]
  >([]);

  const fetchUsers = async (): Promise<void> => {
    const userData = await fetchCollection("users");
    setUsers(userData);
  };

  const fetchChats = async (): Promise<(User & { chatData: Chat })[]> => {
    const queryCondition = where("members", "array-contains", user.uid);

    let allChatData = await fetchCollection("chats", queryCondition);
    allChatData = allChatData.sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );

    const chatDataWithUsers = await Promise.all(
      allChatData.map(async (chat) => {
        const senderId = chat.members.find((id: string) => id !== user?.uid);
        const senderUser = await getDocument("users", senderId);
        return { ...senderUser, chatData: chat };
      })
    );
    return chatDataWithUsers;
  };

  const addChat = async (chatData: Chat): Promise<string | null> => {
    try {
      const docRef = await addDocument("chats", chatData);
      if (typeof docRef === "string") {
        return docRef;
      } else {
        return docRef.id;
      }
    } catch (error) {
      console.error("Error adding chat:", error);
      return null;
    }
  };

  const handleAdd = async (): Promise<void> => {
    setShowUsers(true);
    await fetchUsers();
  };

  const handleBack = (): void => {
    setShowUsers(false);
  };

  const handleAddAndFetchChatData = async (uid: string): Promise<void> => {
    if (!uid || !user || !user.uid) return;
    const isExisting = singleChatData.find((chat) =>
      chat.chatData.members.includes(uid)
    );
    if (isExisting) {
      console.log("Chat already exists");
      setShowUsers(false);
      return;
    }

    const chatData: Omit<Chat, "cid"> = {
      createdAt: new Date().toISOString(),
      lastMessage: "Hello there!",
      members: [uid, user.uid],
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };
    const chatId = await addChat(chatData);
    await updateDocument("chats", chatId, { cid: chatId });

    if (chatId === null) {
      console.log("Error adding chat");
      return;
    }

    const chatDataWithUser = await fetchChats();
    setSingleChatData(chatDataWithUser);
    onChatIdChange(chatId);
    setShowUsers(false);
  };

  useEffect(() => {
    if (!user || !user.uid) return;
    const fetchInitialChatData = async (): Promise<void> => {
      const chatDataWithUser = await fetchChats();
      setSingleChatData(chatDataWithUser);
    };

    fetchInitialChatData();
    const chatRef = collection(db, "chats");
    const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "modified") {
          const chatDataWithUser = await fetchChats();
          setSingleChatData(chatDataWithUser);
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

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
          singleChatData.map((item) => (
            <div
              key={item.uid}
              className={styles.singleChat}
              onClick={() => onChatIdChange(item.chatData.cid)}
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
          <NewChat />
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
