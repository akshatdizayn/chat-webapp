import { useEffect, useState } from "react";
import Image from "next/image";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

import styles from "./SideDrawer.module.scss";
import { formatTime } from "@/generalHelpers";

const SideDrawer = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userCollection = collection(db, "users");
      const collectionData = await getDocs(userCollection);
      const userData = collectionData.docs.map((doc) => doc.data());
      setUsers(userData);
    };
    fetchData();
  }, []);

  console.log(users, "users");
  return (
    <div className={styles.SideDrawer}>
      <div className={styles.header}></div>
      <div className={styles.container}>
        {users.map((item, index) => (
          <div key={item.uid} className={styles.singleChat}>
            <div className={styles.avatar}>
              <Image src={item.photoURL} alt="avatar" width={50} height={50} />
            </div>
            <div className={styles.content}>
              <p className={styles.title}>{item.displayName}</p>
              <p className={styles.desc}>Hello sir I’ve sent you the link</p>
            </div>
            <div className={styles.details}>
              <p className={styles.time}>{formatTime(item.createdAt)}</p>
              <div className={styles.badge}>5</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideDrawer;
