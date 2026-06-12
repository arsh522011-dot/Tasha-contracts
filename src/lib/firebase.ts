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

export const firebaseConfig = {
  apiKey: "AIzaSyDx4x8QiyKxi1KTB5_KZZ8O2eTJXQ367EY",
  authDomain: "tasha-contracts.firebaseapp.com",
  projectId: "tasha-contracts",
  storageBucket: "tasha-contracts.firebasestorage.app",
  messagingSenderId: "298576405181",
  appId: "1:298576405181:web:910957cae6f64342110dd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
    await getDocFromServer(doc(db, 'projects', 'ping'));
    console.log("Firebase connection initialized; database read evaluated successfully.");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or dynamic network status.");
    }
    return false;
  }
}
