import { Router } from 'express';
import { PostController } from '../controllers';
import {
  validateCreatePost,
  validateLoginPost
} from '../middlewares/dataValidator';

export class PostsRoute {
  private postController: PostController;

  constructor(postController: PostController) {
    this.postController = postController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', validateCreatePost, this.postController.createPost.bind(this.postController));
    router.get('/posts', this.postController.getposts.bind(this.postController));

    return router;
  }
}