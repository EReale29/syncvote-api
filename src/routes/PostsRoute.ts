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

    //Creation de post
    router.post('/posts', validateCreatePost, authJwt.verifyToken, this.postController.createPost.bind(this.postController));
    //Affichage de post
    router.get('/posts', this.postController.getPosts.bind(this.postController));
    router.get('/posts/:id', this.postController.getPostById.bind(this.postController));
    router.get('/users/:userId/posts', this.postController.getAllPostsByUser.bind(this.postController));
    router.get('/categories', this.postController.getCategories.bind(this.postController));
    //Mise a jour du post
    router.put('/posts/:id', validateUpdatePost, authJwt.verifyToken, this.postController.updatePostById.bind(this.postController));
    //Suppression du post
    router.delete('/posts/:id', authJwt.verifyToken, this.postController.deletePostById.bind(this.postController));



    return router;
  }
}
