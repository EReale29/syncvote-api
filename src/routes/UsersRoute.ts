import { Router } from 'express';
import { UserController } from '../controllers';
import {
  validateChangePassword,
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser
} from '../middlewares/dataValidator';
import authJwt from "../middlewares/authJwt";

export class UsersRoute {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  createRouter(): Router {
    const router = Router();

    //Creation d'utilisateur
    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));
    //Recuperation d'utilisateur
    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));
    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));
    //Mise a jour de l'utilisateur
    router.put('/users/me', validateUpdateUser, authJwt.verifyToken, this.userController.updateConnectedUser.bind(this.userController));
    router.put('/users/:id', validateUpdateUser, authJwt.verifyToken, this.userController.updateUser.bind(this.userController));
    //Suppression de l'uitlisateur
    router.delete('/users/:id', authJwt.verifyToken, this.userController.deleteUserById.bind(this.userController));
    //Changement de mot de passe
    router.patch('/users/password', validateChangePassword, authJwt.verifyToken, this.userController.changePassword.bind(this.userController));

    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

    return router;
  }
}
