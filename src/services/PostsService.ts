import {Post} from "../types/entities/Post";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";
import {User} from "../types/entities/User";
import {categories} from "../constants/categories";


export class PostsService {

  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {

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
    if (postDoc.data()){
      return {
        status: 200,
        message: 'Post retrieved successfully!',
        data: {
          id: postId,
          ...postDoc.data()
        }
      }
    }

    return {
      status: 404,
      message: 'Post not found',
    }


  }

  async getPostByCategory(categories: string[]): Promise<IResBody> {
    const postsDoc = await this.db.posts.where('categories', 'array-contains-any', categories).get();
    const posts = postsDoc.docs
      .map(doc => doc.data())
      .filter(post => categories.every(category => post.categories?.includes(category)));

    if (posts.length > 0) {
      return {
        status : 200,
        message: 'Posts retrieved successfully!',
        data: posts
      };
    } else {
      return {
        status : 404,
        message: 'Post not found'
      }
    }

  }

  async getAllPostsByUser(userId: string): Promise<IResBody> {
    const postsDoc = await this.db.posts.where('createdBy', '==', userId).get();

    if (postsDoc){
      return {
        status: 200,
        message: 'Posts retrieved successfully!',
        data: {
          ...postsDoc
        }
      }
    } else {
      return {
        status: 404,
        message: 'Post not found'
      }
    }

  }

  async getCategories(): Promise<IResBody> {
    return {
      status: 200,
      message: 'Categories retrieved successfully!',
      data: categories
    }
  }

  async updatePostsById(postId: string, postData: Post): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (postDoc) {
      const postRef = this.db.posts.doc(postId);
      await postRef.set({
        ...postDoc.data(),
        ...postData,
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status: 200,
        message: 'Posts update successfully!',
      }
    } else {

      return {
        status: 404,
        message: 'Post not found'
      }
    }


  }

  async deletePostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (postDoc.data()) {

      const postRef = this.db.posts.doc(postId);
      await postRef.delete();

      return {
        status: 200,
        message: 'Post delete successfully!',
      }
    } else {
      return {
        status: 404,
        message: 'Post not found!',
      }
    }


  }

}
