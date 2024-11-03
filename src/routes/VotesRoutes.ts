import { Router } from 'express';
import { VotesController } from '../controllers';
import authJwt from "../middlewares/authJwt";
import {validateVote} from "../middlewares/dataValidator";

export class VotesRoute {
  private votesController: VotesController;

  constructor(votesController: VotesController) {
    this.votesController = votesController;
  }

  createRouter(): Router {
    const router = Router();

    //Creation du vote
    router.post('/posts/:id/vote', authJwt.verifyToken, validateVote, this.votesController.postVote.bind(this.votesController));
    router.post('/comments/:id/vote', authJwt.verifyToken, validateVote, this.votesController.commentVote.bind(this.votesController));
    //Suppression du vote
    router.delete('/posts/:id/vote', authJwt.verifyToken, this.votesController.postUnvote.bind(this.votesController))
    router.delete('/comments/:id/vote', authJwt.verifyToken, this.votesController.commentUnvote.bind(this.votesController))


    return router;
  }
}
