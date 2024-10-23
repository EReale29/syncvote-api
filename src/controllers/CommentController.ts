import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';

export class CommentController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async createComment(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        const { description } = request.body;

        const commentData = { description };

        const commentResponse = await this.commentsService.createComment(commentData);

        response.status(commentResponse.status).send({
          ...commentResponse,
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

}
