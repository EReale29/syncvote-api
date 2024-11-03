import { FirestoreCollections } from "../types/firestore";
import { PostsService, CommentsService } from '.';
import { IResBody } from "../types/api";
import {Vote} from "../types/entities/Vote"

export class VotesService {

  private db: FirestoreCollections;
  private postsService: PostsService;
  private commentsService: CommentsService;

  constructor(db: FirestoreCollections, postsService: PostsService, commentsService: CommentsService) {
    this.postsService = postsService;
    this.commentsService = commentsService;
    this.db = db;
  }

  async sendVote(voteData: Vote): Promise<IResBody> {

    const voteDoc = await this.db.votes.where('createdBy', '==', voteData.createdBy)
      .where('entityId', '==', voteData.entityId)
      .where('entityType', '==', voteData.entityType)
      .get();


    if (!voteDoc.empty) {
      const doc = voteDoc.docs[0];
      const voteRef = this.db.votes.doc(doc.id);
      await voteRef.set({
        ...doc.data(),
        ...voteData,
      });

      return {
        status: 201,
        message: voteData.entityType + ' Voted successfully!',
      }

    } else {

      const voteRef = this.db.votes.doc();
      await voteRef.set({
        ...voteData,
      });

      if (voteData.entityType == 'post' && voteData.entityId) {
        await this.postsService.votePostById(voteData.entityId);

        return {
          status: 201,
          message: 'Post Voted successfully!',
        }

      } else if (voteData.entityType == 'comment' && voteData.entityId) {
        await this.commentsService.voteCommentById(voteData.entityId);

        return {
          status: 201,
          message: 'Comment Voted successfully!',
        }
      }

    }

    return {
      status: 406,
      message: 'erreur vote !'
    }


  }

  async unvote(voteData: Vote): Promise<IResBody> {
    const voteDoc = await this.db.votes.where('createdBy', '==', voteData.createdBy)
      .where('entityId', '==', voteData.entityId)
      .where('entityType', '==', voteData.entityType)
      .get();

    if (!voteDoc.empty) {
      const doc = voteDoc.docs[0];
      const voteRef = this.db.votes.doc(doc.id);
      if ( voteData.entityType == "post") {
        await this.postsService.unvotePostById(doc.id);
      } else {
        await this.commentsService.unvoteCommentById(doc.id);
      }
      await voteRef.delete();
      return {
        status: 200,
        message: voteData.entityType + ' Unvoted successfully!',
      }
    } else {
      return {
        status: 404,
        message: 'vote not found'
      }


    }
  }

}


