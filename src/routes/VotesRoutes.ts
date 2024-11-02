import { Router } from 'express';
import { VoteController } from '../controllers';
import { validateCreateComment } from '../middlewares/dataValidator';

export class CommentsRoute {
  private voteController: VoteController;

  constructor(voteController: VoteController) {
    this.voteController = voteController;
  }

  createRouter(): Router {
    const router = Router();

    //Creation de commentaire
    router.post('/posts/:id/vote', this.voteController.postVote.bind(this.voteController));
    router.post('/comments/:id/vote', this.voteController.CommentVote.bind(this.voteController));

    return router;
  }
}
