import {Comment} from "../types/entities/Comment";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";
import { RedisClientType } from 'redis';


export class CommentsService {

  private db: FirestoreCollections;
  private redisClient: RedisClientType;

  constructor(db: FirestoreCollections, redisClient: RedisClientType) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async addCommentToPost(commentData: Comment): Promise<IResBody> {
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    const cacheKey = `comments`;
    await this.redisClient.del(cacheKey);

    return {
      status: 200,
      message: 'Comment created successfully!',
    }

  }

  async getComments(): Promise<IResBody> {

    const cacheKey = 'comments';
    let comments: Comment[] = [];

    const cachedComments = await this.redisClient.get(cacheKey);

    if (cachedComments) {
      comments = JSON.parse(cachedComments)
    } else {
      const commentsQuerySnapshot = await this.db.comments.get();
      for (const doc of commentsQuerySnapshot.docs) {
        comments.push({
          id: doc.id,
          ...doc.data(),
        })
      }
      await this.redisClient.set(cacheKey, JSON.stringify(comments), {
        EX: 86400
      });
    }

    if (comments.length > 0) {
      return {
        status: 200,
        message: 'comments retrieved successfully!',
        data: comments
      }
    } else {
      return {
        status: 404,
        message: 'Comments not found'
      }
    }








  }

  async getCommentById(commentId: string): Promise<IResBody> {
    console.log('je rentre dans leservide ');
    const cacheKey = `comments`;
    const cachedComments = await this.redisClient.get(cacheKey);
    let comments: Comment[] = [];

    if (cachedComments) {
      const comment = JSON.parse(cachedComments).find((u: Comment) => u.id === commentId);
      comments.push(comment)
    } else {
      const commentDoc = await this.db.comments.doc(commentId).get();
      if (commentDoc.data()) {
        comments.push({
          id: commentId,
          ...commentDoc.data()});
      }



    }

    if (comments.length > 0) {
      return {
        status: 200,
        message: 'Comments retrieved successfully!',
        data: {
          comments
        }
      }
    }else {
        return {
          status: 404,
          message: 'No comments found.',
        }
      }


    }

  async getAllCommentsOfPost(postId: string): Promise<IResBody> {
    const comments: Comment[] = [];
    const postsQuerySnapshot = await this.db.comments.where("postId", "==", postId).get();

    if (postsQuerySnapshot.docs.length > 0) {
      for (const doc of postsQuerySnapshot.docs){
        comments.push({
          id: doc.id,
          ...doc.data(),
        })
      }

      return {
        status: 200,
        message: 'Posts retrieved successfully!',
        data: comments
      }
    } else {

      return {
        status: 404,
        message: 'comments not found!'
      }
    }


  }

  async updateCommentById(commentId: string, commentData: Comment): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (commentDoc.data()) {
      const commentRef = this.db.comments.doc(commentId);
      await commentRef.set({
        ...commentDoc.data(),
        ...commentData,
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `comments`;
      await this.redisClient.del(cacheKey);

      return {
        status: 200,
        message: 'comments update successfully!',
      }
    } else {
      return {
        status: 404,
        message: 'No comments found.',
      }
    }

  }

  async deleteCommentById(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (commentDoc.data()) {

      const commentRef = this.db.comments.doc(commentId);
      await commentRef.delete();

      const cacheKey = `comments`;
      await this.redisClient.del(cacheKey);

      return {
        status: 200,
        message: 'Comment deleted successfully!',
      }
    } else {
      return {
        status: 500,
        message: 'Comment does not exist!',
      }
    }
  }

  async voteCommentById(commentId: string): Promise<void> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (commentDoc) {
      const currentVoteCount = commentDoc.data()?.voteCount || 0;
      const newVoteCount = currentVoteCount + 1;
      const commentRef = this.db.comments.doc(commentId);
      await commentRef.set({
        ...commentDoc.data(),
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `comments`;
      await this.redisClient.del(cacheKey);

    }
  }

  async unvoteCommentById(commentId: string): Promise<void> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (commentDoc) {
      const currentVoteCount = commentDoc.data()?.voteCount || 0;
      const newVoteCount = currentVoteCount - 1;
      const commentRef = this.db.comments.doc(commentId);
      await commentRef.set({
        ...commentDoc.data(),
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      const cacheKey = `comments`;
      await this.redisClient.del(cacheKey);

    }
  }

}
