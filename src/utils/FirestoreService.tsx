import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { Sphere, TreeNode } from "./Types";

export const fetchUser = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }
};

export const fetchSphere = async (userId: string, sphereId: string) => {
  try {
    const docRef = doc(db, "users", userId, "spheres", sphereId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }
};

export const fetchSpheres = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "spheres"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
};

export const createSphere = async (userId: string, rootNode: TreeNode<SpotifyApi.TrackObjectFull>) => {
  try {
    const data = {
      title: "New Sphere",
      description: `A Sphere inspired by '${rootNode.value.name}' by ${rootNode.value.artists[0].name}.`,
      rootNode,
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, "users", userId, "spheres"), data);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export const updateSphere = async (userId: string, sphere: Sphere, rootNode: TreeNode<SpotifyApi.TrackObjectFull>) => {
  try {
    const docRef = doc(db, "users", userId, "spheres", sphere.id);
    const updatedSphere = {
      ...sphere,
      rootNode,
      lastEditedAt: serverTimestamp()
    }
    await updateDoc(docRef, updatedSphere);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
