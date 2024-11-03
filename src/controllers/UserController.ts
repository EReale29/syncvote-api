import { Request, Response } from 'express';
import { UsersService } from '../services';
import { validationResult } from 'express-validator';
import {User} from "../types/entities/User";

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
    if (request.userRole) {
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
    } else {
      response.status(403).json({
        status: 403,
        message: 'Unauthorized',
      })
    }


  }

  async getUserById(request: Request, response: Response): Promise<void> {
    if (request.userRole == "admin") {
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
    } else {
      response.status(403).json({
        status: 403,
        message: 'Unauthorized',
      })
    }


  }

  async updateUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    }else{
      try {
        if (request.userRole == 'admin') {
          const { email, username } = request.body;
          const userData: Partial<User> = {};
          if (email) { userData.email = email};
          if (username) { userData.username = username};


          const userResponse = await this.usersService.updateUsersById(request.params.id, userData);
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

  async updateConnectedUser(request: Request, response: Response): Promise<void> {
    console.log('je rentre bien dans la fonction controller')
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    }else{
      try {
        if (request.userId) {
          console.log(request.userId)
          const { email, username } = request.body;
          const userData: Partial<User> = {};
          if (email) { userData.email = email};
          if (username) { userData.username = username};


          const userResponse = await this.usersService.updateUsersById(request.userId, userData);
          response.status(userResponse.status).send({
            ...userResponse,
          });
        } else {
          response.status(500).json({
            status: 500,
            message: 'internal server error',
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

  async deleteUserById(request: Request, response: Response): Promise<void> {
    try {
        if (request.userRole == 'admin') {

          const userResponse = await this.usersService.deleteUserById(request.params.id);
          response.status(userResponse.status).send({
            ...userResponse,
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

  async changePassword(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      })
    }else{
      try {
        if (request.userId) {
          const { oldPassword , newPassword } = request.body;
          const data = {oldPassword, newPassword};


          const userResponse = await this.usersService.changePassword(request.userId, data);

          response.status(userResponse.status).send({
            ...userResponse,
          });
        } else {
          response.status(500).json({
            status: 500,
            message: 'internal server error',
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
