import { User } from "../types/entities/User";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";
import { comparePasswords, encryptPassword } from "../utils/password";
import { formatUserData } from "../utils/formatData";
import {generateToken} from "../utils/jwt";
import { RedisClientType } from 'redis';


export class UsersService {

  private db: FirestoreCollections;
  private redisClient: RedisClientType;

  constructor(db: FirestoreCollections, redisClient: RedisClientType) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async createUser(userData: User): Promise<IResBody> {

    const usersQuerySnapshot = await this.db
    .users.where('email', '==', userData.email).get();

    if (usersQuerySnapshot.empty){
      const userRef = this.db.users.doc();
      await userRef.set({
        ...userData,
        password: encryptPassword(userData.password as string),
        role: 'member',
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `users`;
      await this.redisClient.del(cacheKey);

      return {
        status : 201,
        message: 'User Created successfully!',
      }

    } else {
      return {
        status: 409,
        message: 'User already exists',
      }
    }

  }

  async getUsers(): Promise<IResBody> {

    const cacheKey = 'users';
    let users: User[] = [];

    const cachedUsers = await this.redisClient.get(cacheKey);

      if(cachedUsers) {
        users = JSON.parse(cachedUsers);
      } else {
        const usersQuerySnapshot = await this.db.users.get();
        for (const doc of usersQuerySnapshot.docs) {
          const formattedUser = formatUserData(doc.data());
          users.push({
            id: doc.id,
            ...formattedUser,
          });
        }
        await this.redisClient.set(cacheKey, JSON.stringify(users)), {
          EX: 86400
        };

    }

    return {
      status: 200,
      message: 'Users retrieved successfully!',
      data: users
    }
  }

  async getUsersById(userId: string): Promise<IResBody> {
    const cacheKey = 'users';
    const cachedUsers = await this.redisClient.get(cacheKey);
    let users: User[] = [];
    if (cachedUsers) {
      const user = JSON.parse(cachedUsers).find((u: User) => u.id === userId);
      users.push( user )
    } else {
      const userDoc = await this.db.users.doc(userId).get();
      const formattedUser = formatUserData(userDoc.data());
      users.push({
        id: userId,
        ...formattedUser,
      });

    }

    if (users.length > 0) {
      return {
        status: 200,
        message: 'Users retrieved successfully!',
        data: {
          users
        }
      }
    } else {
      return {
        status: 404,
        message: 'User not found!',
      }
    }


  }

  async updateUsersById(userId: string, userData: User ): Promise<IResBody> {
    console.log(userId)
    const userDoc = await this.db.users.doc(userId).get();

    const userRef = this.db.users.doc(userId);
    await userRef.set({
      ...userDoc.data(),
      ...userData,
      updatedAt: firestoreTimestamp.now(),
    });

    const cacheKey = `users`;
    await this.redisClient.del(cacheKey);

    return {
      status: 200,
      message: 'Users update successfully!',
    }

  }

  async deleteUserById(userId: string): Promise<IResBody> {
    const userDoc = await this.db.users.doc(userId).get();

    if (userDoc.data()) {
      console.log(userDoc.data());

      const userRef = this.db.users.doc(userId);
      await userRef.delete();

      const cacheKey = `users`;
      await this.redisClient.del(cacheKey);

      return {
        status: 200,
        message: 'Users delete successfully!',
      }
    } else {
      return {
        status: 500,
        message: 'Users not found!',
      }
    }


  }

  async changePassword(userId: string, data: {oldPassword : string; newPassword: string}): Promise<IResBody> {
    const {oldPassword, newPassword} = data;
    const usersQuerySnapshot = await this.db.users.where('userId', '==', userId).get();

    if (usersQuerySnapshot.empty){
      return {
        status: 401,
        message: 'Unauthorized',
      }
    } else {
      const isPasswordValid = comparePasswords(
        oldPassword,
        usersQuerySnapshot.docs[0].data().password as string,
      );

      if (isPasswordValid) {
        const userDoc = await this.db.users.doc(userId).get()
        const userRef = this.db.users.doc(userId);
        await userRef.set({
          ...userDoc.data(),
          password: encryptPassword(newPassword as string),
          updatedAt: firestoreTimestamp.now(),
        });

        return {
          status: 200,
          message: 'Password changed successfully!',
        }

      } else {
        return {
          status: 402,
          message: 'incorrect password!',
        }
      }
    }

  }

  async login (userData: {email: string; password: string}): Promise<IResBody>{
    const {email, password} = userData;
    const usersQuerySnapshot = await this.db.users.where('email', '==', email).get();

    if (usersQuerySnapshot.empty){
      return {
        status: 401,
        message: 'Unauthorized',
      }
    } else {
      const isPasswordValid = comparePasswords(
        password,
        usersQuerySnapshot.docs[0].data().password as string,
      );

      if (isPasswordValid) {
        const formatteUser = formatUserData(usersQuerySnapshot.docs[0].data());

        return{
          status: 200,
          message: 'User login successfully!',
          data: {
            user: { ...formatteUser},
            token: generateToken(usersQuerySnapshot.docs[0].id, formatteUser.role),
          }
        }
      } else {
        return {
          status: 401,
          message: 'Unauthorized',
        }
      }
    }
  }

}
