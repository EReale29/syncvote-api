import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';
import {Post} from "../types/entities/Post";

export class PostController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  async createPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        const { title, description, categories } = request.body;

        const postData = {
          title,
          description,
          categories,
          createdBy: request.userId,
        };

        const postResponse = await this.postsService.createPost(postData);

        response.status(postResponse.status).send({
          ...postResponse,
        });

      } catch (error){
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }

    }

  }

  async getPosts(request: Request, response: Response): Promise<void> {

    try {
      const postResponse = await this.postsService.getPosts();

      response.status(postResponse.status).send({
        ...postResponse,
      });
    } catch (error){

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      })
    }

  }

  async getPostById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const postResponse = await this.postsService.getPostById(request.params.id);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'Post Not Found',
        })
      }

    } catch (error){

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      })
    }

  }

  async updatePostById(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    }else{
      try {
        if (request.params.id == request.userId || request.userRole == 'admin') {
          const { title, description, categories} = request.body;
          const postData: Partial<Post> = {};
          if (title) { postData.title = title};
          if (description) { postData.description = title};
          if (categories) { postData.categories = categories; }


          const userResponse = await this.postsService.updatePostsById(request.params.id, postData);
          response.status(userResponse.status).send({
            ...userResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'User Not Found',
          })
        }

      } catch (error){

        response.status(500).json({
          status: 500,
          message: 'internal server error',
          data: error
        })
      }
    }


  }
}
