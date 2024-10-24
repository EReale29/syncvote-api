import {Post} from "../types/entities/Post";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";
import {formatUserData} from "../utils/formatData";


export class PostsService {

  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {

    const postsQuerySnapshot = await this.db.posts.get();

    if (postsQuerySnapshot.empty){
      const postRef = this.db.posts.doc();
      await postRef.set({
        ...postData,
        voteCount: 0,
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status : 201,
        message: 'Post Created successfully!',
      }

    } else {
      return {
        status: 409,
        message: 'Post already exists',
      }
    }

  }

  async getPosts(): Promise<IResBody> {

    const posts: Post[] = [];

    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs){
      posts.push({
        id: doc.id,
        ...doc.data(),
      })

    }

    return {
      status: 200,
      message: 'posts retrieved successfully!',
      data: posts
    }
  }

  async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    return {
      status: 200,
      message: 'Users retrieved successfully!',
      data: {
        id: postId,
        ...postDoc.data()
      }
    }

  }

}
