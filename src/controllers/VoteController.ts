import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export class VoteController {
  private votesService: VotesService;

  constructor(votesService: VotesService) {
    this.votesService = votesService;
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


      } catch (error){
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }

    }

  }


}
