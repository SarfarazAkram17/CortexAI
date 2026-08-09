import { cert, initializeApp } from "firebase-admin";
import "dotenv/config";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

export const app = initializeApp({
  credential: cert(serviceAccount),
});
