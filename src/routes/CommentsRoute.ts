import { Router } from 'express';
import { CommentController } from '../controllers';
import { validateCreateComment } from '../middlewares/dataValidator';
import authJwt from "../middlewares/authJwt";

export class CommentsRoute {
  private commentController: CommentController;

  constructor(commentController: CommentController) {
    this.commentController = commentController;
  }

  createRouter(): Router {
    const router = Router();

    //Creation de commentaire
    router.post('/posts/:postId/comments', validateCreateComment, authJwt.verifyToken, this.commentController.addCommentToPost.bind(this.commentController));
    // Recuperation des commentaire
    router.get('/comments', this.commentController.getComments.bind(this.commentController));
    router.get('/comments/:id', this.commentController.getCommentById.bind(this.commentController));
    router.get('/posts/:postId/comments', this.commentController.getAllCommentsOfPost.bind(this.commentController));
    // Mise a jour du commentaire
    router.put('/comments/:id', authJwt.verifyToken, this.commentController.updateCommentById.bind(this.commentController));
    // Suppression du commentaire
    router.delete('/comments/:id', authJwt.verifyToken, this.commentController.deleteCommentById.bind(this.commentController));

    return router;
  }
}
