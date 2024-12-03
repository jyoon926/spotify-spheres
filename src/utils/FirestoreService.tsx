import { addDoc, collection, doc, getCountFromServer, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { Sphere, Track, TreeNode } from "./Types";

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

export const fetchSpheresCount = async (userId: string) => {
  try {
    const snapshot = await getCountFromServer(collection(db, "users", userId, "spheres"));
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting document count:', error);
  }
}

export const createSphere = async (userId: string, rootNode: TreeNode<Track>) => {
  try {
    const data = {
      title: "New Sphere",
      description: `A Sphere inspired by '${rootNode.value.name}' by ${rootNode.value.artists[0].name}.`,
      rootNode,
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    }
    console.log(data);
    const docRef = await addDoc(collection(db, "users", userId, "spheres"), data);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export const updateSphereRootNode = async (userId: string, sphere: Sphere, rootNode: TreeNode<Track>) => {
  try {
    const docRef = doc(db, "users", userId, "spheres", sphere.id);
    await updateDoc(docRef, { rootNode, lastEditedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error editing document: ", error);
  }
}

export const updateSphereTitle = async (userId: string, sphere: Sphere, title: string) => {
  try {
    const docRef = doc(db, "users", userId, "spheres", sphere.id);
    await updateDoc(docRef, { title, lastEditedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error editing document: ", error);
  }
}

export const updateSphereDescription = async (userId: string, sphere: Sphere, description: string) => {
  try {
    const docRef = doc(db, "users", userId, "spheres", sphere.id);
    await updateDoc(docRef, { description, lastEditedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error editing document: ", error);
  }
}
