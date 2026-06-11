import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase/config"; 
import {collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      return;
    }

    // Reference the notifications collection in the firestore
    const notificationsRef = collection(db, "notifications");
    
    const q = query(notificationsRef, where("recipientUid", "==", user.uid));

    // webSocket pipeline connection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveAlerts = snapshot.docs.map((doc) => ({
        id: doc.id, // Stores the unique Firestore document auto-generated ID string
        ...doc.data(),
      }));

      // Sort notifications locally by creation date 
      liveAlerts.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setNotifications(liveAlerts);
    }, (error) => {
      console.error("Notification synchronization connection failed:", error);
    });

    return () => unsubscribe();
  }, [user]);

  async function markAsRead(id) {
    try {
      const docRef = doc(db, "notifications", id);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error("Failed to mark single notification as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      const batch = writeBatch(db);
      
      notifications.forEach((n) => {
        if (!n.read) {
          const docRef = doc(db, "notifications", n.id);
          batch.update(docRef, { read: true });
        }
      });

      await batch.commit();
    } catch (error) {
      console.error("Failed to batch execute update operations:", error);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
