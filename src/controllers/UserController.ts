import { Request, Response } from 'express';
import { UsersService } from '../services';
import { validationResult } from 'express-validator';

export class UserController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async createUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        const { email, password, username } = request.body;

        const userData = { email, password, username};

        const userResponse = await this.usersService.createUser(userData);

        response.status(userResponse.status).send({
          ...userResponse,
        })

      } catch (error){
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }

    }

  }

  async getUsers(request: Request, response: Response): Promise<void> {

    try {
      const userResponse = await this.usersService.getUsers();

      response.status(userResponse.status).send({
        ...userResponse,
      });
    } catch (error){

      response.status(500).json({
        status: 500,
        message: 'internal server error',
        data: error
      })
    }

  }

  async getUserById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const userResponse = await this.usersService.getUsersById(request.params.id);

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

  async login(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    } else {
      try {
        const {email, password} = request.body;
        const userData = { email, password };

        const userResponse = await this.usersService.login(userData);

        response.status(userResponse.status).json({
          ...userResponse
        });
      } catch (error) {

        response.status(500).json({
          status: 500,
          message: 'internal server error',
          data: error
        })
      }
    }
  }

}
