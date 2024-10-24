import { Router } from 'express';
import { PostController } from '../controllers';
import { validateCreatePost } from '../middlewares/dataValidator';

export class PostsRoute {
  private postController: PostController;

  constructor(postController: PostController) {
    this.postController = postController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', validateCreatePost, this.postController.createPost.bind(this.postController));
    router.get('/posts', this.postController.getPosts.bind(this.postController));
    router.get('/posts/:id', this.postController.getPostById.bind(this.postController));

    return router;
  }
}
