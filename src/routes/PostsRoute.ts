import { Router } from 'express';
import { PostController } from '../controllers';
import {
  validateCreatePost,
  validateUpdatePost
} from '../middlewares/dataValidator';
import authJwt from "../middlewares/authJwt";

export class PostsRoute {
  private postController: PostController;

  constructor(postController: PostController) {
    this.postController = postController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', validateCreatePost, this.postController.createPost.bind(this.postController));
    router.get('/posts', authJwt.verifyToken, this.postController.getPosts.bind(this.postController));
    router.get('/posts/:id', authJwt.verifyToken, this.postController.getPostById.bind(this.postController));
    router.put('/posts/:id', validateUpdatePost, authJwt.verifyToken, this.postController.updatePostById.bind(this.postController));

    return router;
  }
}
