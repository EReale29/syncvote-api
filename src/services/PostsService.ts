import {Post} from "../types/entities/Post";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";
import {categories} from "../constants/categories";
import { RedisClientType } from 'redis';


export class PostsService {

  private db: FirestoreCollections;
  private redisClient: RedisClientType;

  constructor(db: FirestoreCollections, redisClient: RedisClientType) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async createPost(postData: Post): Promise<IResBody> {

    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    const cacheKey = `posts`;
    await this.redisClient.del(cacheKey);

    return {
      status : 201,
      message: 'Post Created successfully!',
    }

  }

  async getPosts(): Promise<IResBody> {

    const cacheKey = `posts`;
    let posts: Post[] = [];

    const cachedPosts = await this.redisClient.get(cacheKey)

    if (cachedPosts) {
      posts = JSON.parse(cachedPosts);
    } else {
      const postsQuerySnapshot = await this.db.posts.get();

      for (const doc of postsQuerySnapshot.docs){
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      }

      await this.redisClient.set(cacheKey, JSON.stringify(posts), {
        EX:86400
      });
    }




    return {
      status: 200,
      message: 'posts retrieved successfully!',
      data: posts
    }
  }

  async getPostById(postId: string): Promise<IResBody> {
    const cacheKey = `posts`;
    const cachedPosts = await this.redisClient.get(cacheKey);
    let posts: Post[] = [];

    if (cachedPosts) {
      const post = JSON.parse(cachedPosts).find((u: Post) => u.id === postId);
      posts.push(post )
    } else {
      const postDoc = await this.db.posts.doc(postId).get();
      if (postDoc.data()) {
        posts.push({
          id: postId,
          ...postDoc.data(),
        })
      }
    }

    if (posts.length > 0) {
      return {
        status: 200,
        message: 'Post retrieved successfully!',
        data: posts
      }
    }

    return {
      status: 404,
      message: 'Post not found',
    }


  }

  async getPostByCategory(categories: string[]): Promise<IResBody> {

    const cacheKey = `posts`;
    const cachedPosts = await this.redisClient.get(cacheKey);
    let posts: Post[] = [];

    if (cachedPosts) {
      const postsByCategory = JSON.parse(cachedPosts).filter((u: Post) =>
        categories.every(category => u.categories?.includes(category))
      );
      posts.push(...postsByCategory);
    } else {
      const postsDoc = await this.db.posts.where('categories', 'array-contains-any', categories).get();
      posts.push(
        ...postsDoc.docs
          .map(doc => doc.data())
          .filter(post => categories.every(category => post.categories?.includes(category)))
      )
    }

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

    const cacheKey = `posts`;
    const cachedPosts = await this.redisClient.get(cacheKey);
    let posts: Post[] = [];
    if (cachedPosts) {
      const postsByUser = JSON.parse(cachedPosts).filter((u: Post) => u.createdBy === userId);
      posts.push(...postsByUser);

    } else {
      const postDoc = await this.db.posts.where('createdBy', '==', userId).get();
      for (const doc of postDoc.docs) {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      }

    }

    if (posts){
      return {
        status: 200,
        message: 'Posts retrieved successfully!',
        data: posts
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

      const cacheKey = `posts`;
      await this.redisClient.del(cacheKey);

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

      const cacheKey = `posts`;
      await this.redisClient.del(cacheKey);

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

  async votePostById(postId: string): Promise<void> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (postDoc) {
      const currentVoteCount = postDoc.data()?.voteCount || 0;
      const newVoteCount = currentVoteCount + 1;
      const postRef = this.db.posts.doc(postId);
      await postRef.set({
        ...postDoc.data(),
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `posts`;
      await this.redisClient.del(cacheKey);

    }
  }

  async unvotePostById(postId: string): Promise<void> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (postDoc) {
      const currentVoteCount = postDoc.data()?.voteCount || 0;
      const newVoteCount = currentVoteCount - 1;
      const postRef = this.db.posts.doc(postId);
      await postRef.set({
        ...postDoc.data(),
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `posts`;
      await this.redisClient.del(cacheKey);

    }
  }



}
