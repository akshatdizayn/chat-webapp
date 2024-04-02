import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const fetchCollection = async (
  collectionName,
  queryCondition = null
) => {
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

export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data }, { merge: true });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};
