import { useEffect, useState } from "react";
import classNames from "classnames";

import useAuth from "@/hooks/useAuth";
import {
  addDocument,
  fetchMessages,
  getDocument,
  updateDocument,
} from "@/actions/chat.actions";

import Emoji from "../../app/icons/Emoji";
import Send from "../../app/icons/Send";
import styles from "./ChatScreen.module.scss";
import { Message } from "@/types/interfaces.types";

interface Props {
  cid: string | null;
}

const ChatScreen: React.FC<Props> = ({ cid }) => {
  const [user] = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState<string>("");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (cid && user && user.uid) {
        const chat = await getDocument("chats", cid);
        const members = chat.members;
        const receiver = members.find((id: string) => id !== user.uid);
        setReceiverId(receiver);
      }
    };
    fetchData();

    const unsubscribe = fetchMessages(cid, setMessages);
    return () => unsubscribe();
  }, [cid, user]);

  const sendMessage = async (): Promise<void> => {
    if (message.trim() === "") {
      setMessage("");
      return;
    }
    const chatId = cid;
    if (chatId && user && user.uid && receiverId) {
      const newMessage: Message = {
        chatId,
        content: message,
        sender: user.uid,
        receiver: receiverId,
        createdAt: new Date().toISOString(),
      };

      await addDocument("messages", newMessage);
      await updateDocument("chats", chatId, {
        lastMessage: message,
        updatedAt: new Date().toISOString(),
      });
      setMessage("");
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const aTimestamp = Date.parse(a.createdAt);
    const bTimestamp = Date.parse(b.createdAt);

    // Sort in ascending order so that the oldest message comes first
    return aTimestamp - bTimestamp;
  });

  return (
    <div className={styles.ChatScreen}>
      <div className={styles.chatBox}>
        <div className={styles.chats}>
          {user &&
            sortedMessages.map((msg) => (
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
