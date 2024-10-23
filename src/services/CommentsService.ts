import {Comment} from "../types/entities/Comment";
import { FirestoreCollections } from "../types/firestore";
import { IResBody } from "../types/api";
import { firestoreTimestamp } from "../utils/firestore-helpers";


export class CommentsService {

  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createComment(commentData: Comment): Promise<IResBody> {

    const commentsQuerySnapshot = await this.db.comments.get();

    if (commentsQuerySnapshot.empty){
      const commentRef = this.db.comments.doc();
      await commentRef.set({
        ...commentData,
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status : 201,
        message: 'Comment Created successfully!',
      }

    } else {
      return {
        status: 409,
        message: 'Comment already exists',
      }
    }

  }

  async getComments(): Promise<IResBody> {

    const comments: Comment[] = [];

    const commentsQuerySnapshot = await this.db.comments.get();

    for (const doc of commentsQuerySnapshot.docs){
      comments.push({
        id: doc.id,
        ...doc.data(),
      })

    }

    return {
      status: 200,
      message: 'commentss retrieved successfully!',
      data: comments
    }
  }

}
