import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Message } from "@/types/interfaces.types";

export const fetchCollection = async (
  collectionName: string,
  queryCondition = null
): Promise<any[]> => {
  const collectionRef = collection(db, collectionName);
  const q = queryCondition
    ? query(collectionRef, queryCondition)
    : collectionRef;
  const data = await getDocs(q);
  return data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addDocument = async (
  collectionName: string,
  data: any
): Promise<DocumentReference | string | null> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data }, { merge: true });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<any> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const fetchMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, where("chatId", "==", chatId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        chatId: doc.data().chatId,
        content: doc.data().content,
        createdAt: doc.data().createdAt,
        sender: doc.data().sender,
        receiver: doc.data().receiver,
      });
    });
    callback(messages);
  });

  // Return the unsubscribe function
  return unsubscribe;
};
