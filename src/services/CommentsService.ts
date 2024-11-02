import {Comment} from "../types/entities/Comment";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";


export class CommentsService {

  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async addCommentToPost(commentData: Comment): Promise<IResBody> {
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });
    return {
      status: 200,
      message: 'Comment created successfully!',
    }

  }

  async getComments(): Promise<IResBody> {

    const comments: Comment[] = [];

    const commentsQuerySnapshot = await this.db.comments.get();

    if (commentsQuerySnapshot.docs.length > 0) {
      for (const doc of commentsQuerySnapshot.docs){
        comments.push({
          id: doc.id,
          ...doc.data(),
        })

      }

      return {
        status: 200,
        message: 'comments retrieved successfully!',
        data: comments
      }
    } else {
      return {
        status: 404,
        message: 'No comments found.',
      }
    }


  }

  async getCommentById(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    if (commentDoc.data()) {
      return {
        status: 200,
        message: 'Users retrieved successfully!',
        data: {
          id: commentId,
          ...commentDoc.data()
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
}
