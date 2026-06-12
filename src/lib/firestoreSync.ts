import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

/**
 * Fetches an entire collection from Firestore. 
 * If it doesn't exist or is empty in Firestore, it optionally populates it with default seed data.
 */
export async function fetchCollectionFromFirestore<T extends { id: string }>(
  collectionName: string,
  defaults: T[]
): Promise<T[]> {
  const path = collectionName;
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const items: T[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T);
    });

    if (items.length === 0 && defaults.length > 0) {
      console.log(`Firestore collection "${path}" is empty. Seeding ${defaults.length} items...`);
      await seedCollectionToFirestore(path, defaults);
      return defaults;
    }

    return items;
  } catch (error) {
    console.warn(`Firestore read failed for "${path}". Falling back to localStorage/memory.`, error);
    // Since we handle errors gracefully, we don't crash, but throw a debug trace
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {
      // Slurp it so caller is not crashed
    }
    throw error;
  }
}

/**
 * Seeds custom static defaults.
 */
export async function seedCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  const path = collectionName;
  try {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docRef = doc(db, path, item.id);
      // Remove or keep exact fields
      const { id, ...data } = item;
      batch.set(docRef, data);
    });
    await batch.commit();
    console.log(`Seeded matching "${path}" records successfully to Cloud Firestore.`);
  } catch (error) {
    console.error(`Failed to seed collection "${path}":`, error);
  }
}

/**
 * Saves or updates a single item in Firestore.
 */
export async function saveItemToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  const path = collectionName;
  try {
    const { id, ...data } = item;
    await setDoc(doc(db, path, id), data);
    console.log(`Saved "${path}/${id}" to live cloud database.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

/**
 * Deletes a single document.
 */
export async function deleteItemFromFirestore(
  collectionName: string,
  id: string
): Promise<void> {
  const path = collectionName;
  try {
    await deleteDoc(doc(db, path, id));
    console.log(`Deleted document "${path}/${id}" from Cloud Firestore.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

/**
 * Saves a whole listing (replacing or overwriting).
 */
export async function saveAllCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  const path = collectionName;
  try {
    // Standard batch write to align fast updates
    const batch = writeBatch(db);
    items.forEach((item) => {
      const { id, ...data } = item;
      batch.set(doc(db, path, id), data);
    });
    await batch.commit();
    console.log(`Synced batch state successfully to "${path}".`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches the system config metadata document.
 */
export async function fetchSystemInfoFromFirestore(defaultSystem: any): Promise<any> {
  const path = "system";
  const docId = "config";
  try {
    const docSnap = await getDoc(doc(db, path, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No live system config document in Firestore. Initializing with defaults...");
      await setDoc(doc(db, path, docId), defaultSystem);
      return defaultSystem;
    }
  } catch (error) {
    console.warn("Could not read system metadata from Firestore. Falling back to local state.", error);
    try {
      handleFirestoreError(error, OperationType.GET, `${path}/${docId}`);
    } catch (e) {
      // Slurp
    }
    throw error;
  }
}

/**
 * Saves the global system config metadata.
 */
export async function saveSystemInfoToFirestore(systemInfo: any): Promise<void> {
  const path = "system";
  const docId = "config";
  try {
    await setDoc(doc(db, path, docId), systemInfo);
    console.log("Synchronized global system branding metadata to Live cloud storage.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${docId}`);
  }
}
