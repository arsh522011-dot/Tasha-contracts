import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  getDocs,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase with dynamic parameters
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Dry-run checking Firestore availability on app initialization
export async function testConnection() {
  try {
    const connectionPromise = getDocFromServer(doc(db, 'projects', 'ping'));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 1500)
    );
    await Promise.race([connectionPromise, timeoutPromise]);
    console.log("Firebase connection initialized; database read evaluated successfully.");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message === 'timeout') {
      console.warn("Firestore connection check timed out (1.5s limit reached). Falling back to offline mode.");
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore is offline. Falling back to offline mode.");
    } else {
      console.warn("Firestore connection check failed:", error);
    }
    return false;
  }
}
