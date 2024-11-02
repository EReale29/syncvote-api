import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';
import {Post} from "../types/entities/Post";
import {VerificationDatabase} from "../utils/verificationDatabase";

export class PostController {
  private postsService: PostsService;
  private verificationDatabase: VerificationDatabase;

  constructor(postsService: PostsService, verificationDatabase: VerificationDatabase) {
    this.postsService = postsService;
    this.verificationDatabase = verificationDatabase;
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
      if (request.query.category){
        let categories = request.query.category as string[];
        if (!Array.isArray(categories)) {
          categories = [categories];
        }
        console.log(categories)
        const postResponse = await this.postsService.getPostByCategory(categories);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } else {
        const postResponse = await this.postsService.getPosts();

        response.status(postResponse.status).send({
          ...postResponse,
        });
      }

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

  async getAllPostsByUser(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.userId) {
        const postResponse = await this.postsService.getAllPostsByUser(request.params.userId);

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

  async getCategories(request: Request, response: Response): Promise<void> {
    try {
      const categoriesResponse = await this.postsService.getCategories();

      response.status(categoriesResponse.status).send({
        ...categoriesResponse,
      });
    } catch (error){

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      });
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
        if ((request.userId && await this.verificationDatabase.isOwnerPost(request.userId, request.params.id)) || request.userRole == 'admin') {
          const { title, description, categories} = request.body;
          const postData: Partial<Post> = {};
          if (title) { postData.title = title};
          if (description) { postData.description = description};
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

  async deletePostById(request: Request, response: Response): Promise<void> {
    try {
      if ((request.userId && await this.verificationDatabase.isOwnerPost(request.userId, request.params.id)) || request.userRole == 'admin') {

        const postResponse = await this.postsService.deletePostById(request.params.id);
        response.status(postResponse.status).send({
          ...postResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User Not Found'
        });
      }
    } catch (error){
      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      });
    }

  }
}
