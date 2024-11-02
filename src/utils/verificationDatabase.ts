import {FirestoreCollections} from "../types/firestore";


export class VerificationDatabase {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async isOwnerPost(userId: string, postId: string): Promise<boolean> {
    const postDoc = await this.db.posts.doc(postId).get();
    // @ts-ignore
    if (postDoc.exists && postDoc.data()?.createdBy == userId) {
      return true
    }
    return false
  }

  async isOwnerComment(userId: string, commentId: string): Promise<boolean> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    // @ts-ignore
    if (commentDoc.exists && commentDoc.data()?.createdBy == userId) {
      return true
    }
    return false
  }

}
