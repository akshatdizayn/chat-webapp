import { useEffect, useState } from "react";
import classNames from "classnames";
import { where } from "firebase/firestore";

import useAuth from "@/hooks/useAuth";
import {
  addDocument,
  fetchCollection,
  fetchMessages,
  getDocument,
  updateDocument,
} from "@/actions/chat.actions";

import Emoji from "../../app/icons/Emoji";
import Send from "../../app/icons/Send";
import styles from "./ChatScreen.module.scss";

const ChatScreen = ({ cid }) => {
  console.log("cid", cid);
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

    const chat = await getDocument("chats", cid);
    const members = chat.members;
    const receiverId = members.find((id) => id !== user.uid);

    await addDocument("messages", {
      chatId: cid,
      content: message,
      sender: user.uid,
      receiver: receiverId,
      createdAt: new Date(),
    });

    await updateDocument("chats", chat.cid, {
      lastMessage: message,
      updatedAt: new Date().getTime(),
    });
    setMessage("");
  };
  const sortedMessages = [...messages].sort(
    (a, b) => a.createdAt - b.createdAt
  );

  return (
    <div className={styles.ChatScreen}>
      <div className={styles.chatBox}>
        <div className={styles.chats}>
          {sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={classNames({
                [styles.sent]: msg.sender === user.uid,
                [styles.received]: msg.sender !== user.uid,
              })}
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
