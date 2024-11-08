import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

export const createOrUpdateUser = async (userInfo) => {
  try {
    const userRef = doc(db, "users", userInfo.email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        subscriptionStatus: "inactive", // default status
        createdAt: new Date().toISOString(),
      });
    }

    // Get the latest user data
    const updatedUserDoc = await getDoc(userRef);
    return {
      ...userInfo,
      ...updatedUserDoc.data(),
    };
  } catch (error) {
    console.error("Error managing user document:", error);
    throw error;
  }
};

export const getUserSubscriptionStatus = async (email) => {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().subscriptionStatus === "active";
    }
    return false;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
};

export const checkSubscriptionStatus = async (email) => {
  try {
    // Query users collection where email matches
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching user document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Check if subscriptionStatus is specifically "active"
      return userData.subscriptionStatus === "active";
    }

    return false;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};
