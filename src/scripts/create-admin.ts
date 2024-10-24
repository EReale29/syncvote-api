import * as _dotenv from "dotenv";
_dotenv.config();

import {db, firestoreTimestamp} from "../utils/firestore-helpers";
import { encryptPassword } from "../utils/password";

async function createAdmin(): Promise<void> {
  if (process.env.ADMIN_MAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_USERNAME) {
    const usersQuerySnapshot = await db
      .users.where('email', '==', process.env.ADMIN_MAIL).get();

    if (usersQuerySnapshot.empty) {
      const userRef = db.users.doc();
      await userRef.set({
        email: process.env.ADMIN_MAIL,
        username: process.env.ADMIN_USERNAME,
        password: encryptPassword(process.env.ADMIN_PASSWORD as string),
        role: 'admin',
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      console.log("Admin Created successfully!");
    }else {
      console.log("Admin already exists!");
    }
  }
}

createAdmin().catch((err) => {
  console.error(err);
})
