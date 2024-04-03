import { useEffect, useState } from "react";
import { where } from "firebase/firestore";

import useAuth from "@/hooks/useAuth";
import {
  addDocument,
  fetchCollection,
  fetchMessages,
  updateDocument,
} from "@/actions/chat.actions";

import Emoji from "../../app/icons/Emoji";
import Send from "../../app/icons/Send";
import styles from "./ChatScreen.module.scss";

const ChatScreen = ({ cid }) => {
  const [user] = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchMessages(cid, setMessages);

    return () => unsubscribe();
  }, [cid]);

  const sendMessage = async () => {
    if (message.trim() === "") {
      setMessage("");
      return;
    }

    const chats = await fetchCollection(
      "chats",
      where("members", "array-contains", cid)
    );
    const chat = chats[0];
    const members = chat.members;
    const receiverId = members.find((id) => id !== user.uid);

    await addDocument("messages", {
      chatId: cid,
      content: message,
      sender: user.uid,
      receiver: receiverId,
      createdAt: new Date(),
    });

    await updateDocument("chats", chat.id, {
      lastMessage: message,
      updatedAt: new Date().getTime(),
    });
    setMessage("");
  };

  return (
    <div className={styles.ChatScreen}>
      <div className={styles.chatBox}>
        <div className={styles.chats}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === user.uid ? styles.sent : styles.received
              }
            >
              <p className={styles.message}>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chatBottom}>
        <div className={styles.emoji}>
          <Emoji />
        </div>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Type a message"
            className={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
        <button className={styles.sendBtn} onClick={sendMessage}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
