import { Router } from 'express';
import { CommentController } from '../controllers';
import { validateCreateComment } from '../middlewares/dataValidator';

export class CommentsRoute {
  private commentController: CommentController;

  constructor(commentController: CommentController) {
    this.commentController = commentController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/comments', validateCreateComment, this.commentController.createComment.bind(this.commentController));
    router.get('/comments', this.commentController.getComments.bind(this.commentController));

    return router;
  }
}
