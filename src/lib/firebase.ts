import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getConfig } from './config';

let app = initializeApp(getConfig().firebase);
let db = getFirestore(app);

export const initializeFirebase = (config: any) => {
  app = initializeApp(config);
  db = getFirestore(app);
};

export { db };

export type Schedule = {
  id: string;
  name: string;
  time: string;
  created_at: string;
};