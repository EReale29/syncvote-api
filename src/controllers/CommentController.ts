import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';
import {Comment} from "../types/entities/Comment";
import {Post} from "../types/entities/Post";
import {VerificationDatabase} from "../utils/verificationDatabase";

export class CommentController {
  private commentsService: CommentsService;
  private verificationDatabase: VerificationDatabase;

  constructor(commentsService: CommentsService, verificationDatabase: VerificationDatabase) {
    this.commentsService = commentsService;
    this.verificationDatabase = verificationDatabase;
  }


  async addCommentToPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        if (request.userId && request.params.postId){
          const { description } = request.body ;

          const commentData: Comment = {
            description: description,
            postId: request.params.postId,
            createdBy: request.userId,
          };

          const commentResponse = await this.commentsService.addCommentToPost(commentData);

          response.status(commentResponse.status).send({
            ...commentResponse,
          });
        } else {
          response.status(500).json({
            status: 500,
            message: 'Internal server error',
          })
        }

      } catch (error){
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }

    }

  }

  async getComments(request: Request, response: Response): Promise<void> {

    try {
      const commentResponse = await this.commentsService.getComments();

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error){

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      })
    }

  }

  async getCommentById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const commentResponse = await this.commentsService.getCommentById(request.params.id);

        response.status(commentResponse.status).send({
          ...commentResponse,
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

  async getAllCommentsOfPost(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.postId) {
        const commentResponse = await this.commentsService.getAllCommentsOfPost(request.params.postId);

        response.status(commentResponse.status).send({
          ...commentResponse,
        });
      } else {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
        })
      }

    } catch (error) {

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      });
    }
  }

  async updateCommentById(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    }else{
      try {
        if ((request.userId && await this.verificationDatabase.isOwnerComment(request.userId, request.params.id)) || request.userRole == 'admin') {
          const { description } = request.body;
          const commentData: Partial<Post> = {};
          if (description) { commentData.description = description};


          const commentResponse = await this.commentsService.updateCommentById(request.params.id, commentData);
          response.status(commentResponse.status).send({
            ...commentResponse,
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

  async deleteCommentById(request: Request, response: Response): Promise<void> {
    try {
      if ((request.userId && await this.verificationDatabase.isOwnerComment(request.userId, request.params.id)) || request.userRole == 'admin') {

        const commentResponse = await this.commentsService.deleteCommentById(request.params.id);
        response.status(commentResponse.status).send({
          ...commentResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User Not Found',
        })
      }

    } catch (error) {

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      })
    }
  }
}

