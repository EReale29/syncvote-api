import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {VotesService} from "../services";
import {Vote} from "../types/entities/Vote";

export class VotesController {
  private votesService: VotesService;

  constructor(votesService: VotesService) {
    this.votesService = votesService;
  }

  async getVotePostById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {

        const voteData: Vote = {
          entityType: "post",
          entityId: request.params.id,
        };

        const voteResponse = await this.votesService.getVoteById(voteData);

        response.status(voteResponse.status).send({
          voteResponse,
        });
      }


    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async getVoteCommentById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {

        const voteData: Vote = {
          entityType: "comment",
          entityId: request.params.id,
        };

        const voteResponse = await this.votesService.getVoteById(voteData);

        response.status(voteResponse.status).send({
          voteResponse,
        });
      }


    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async getVoteByUser(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {

        const voteData: Vote = {
          createdBy: request.params.id,
        };

        const voteResponse = await this.votesService.getVoteByUser(voteData);

        response.status(voteResponse.status).send({
          voteResponse,
        });
      }


    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async postVote(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        if (request.userId && request.params.id && request.body) {

          const voteData: Vote= {
            entityType: "post",
            entityId: request.params.id,
            type: request.body.vote,
            createdBy: request.userId,
          };

          const voteResponse = await this.votesService.sendVote(voteData);

          response.status(voteResponse.status).send({
            voteResponse,
          });
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

  async postUnvote(request: Request, response: Response): Promise<void> {
    try {
      if (request.userId && request.params.id) {

        const voteData: Vote = {
          entityType: "post",
          entityId: request.params.id,
          createdBy: request.userId,
        };

        const voteResponse = await this.votesService.unvote(voteData);

        response.status(voteResponse.status).send({
          voteResponse,
        });
      }


    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async commentVote(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        if (request.userId && request.params.id && request.body) {

          const voteData: Vote= {
            entityType: "comment",
            entityId: request.params.id,
            type: request.body.vote,
            createdBy: request.userId,
          };

          const voteResponse = await this.votesService.sendVote(voteData);

          response.status(voteResponse.status).send({
            ...voteResponse,
          });
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

  async commentUnvote(request: Request, response: Response): Promise<void> {
    try {
      if (request.userId && request.params.id) {

        const voteData: Vote = {
          entityType: "comment",
          entityId: request.params.id,
          createdBy: request.userId,
        };

        const voteResponse = await this.votesService.unvote(voteData);

        response.status(voteResponse.status).send({
          voteResponse,
        });
      }


    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }
}
