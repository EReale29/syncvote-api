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

    //Creation de commentaire
    router.post('/posts/:id/vote', authJwt.verifyToken, validateVote, this.votesController.postVote.bind(this.votesController));
    router.post('/comments/:id/vote', authJwt.verifyToken, validateVote, this.votesController.commentVote.bind(this.votesController));

    return router;
  }
}
