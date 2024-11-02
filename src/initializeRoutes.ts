import * as controllers from './controllers';
import * as routes from './routes';
import * as services from './services';
import {VerificationDatabase} from "./utils/verificationDatabase";
import { FirestoreCollections } from './types/firestore';
import { RedisClientType } from 'redis';


export function initializeRoutes(db: FirestoreCollections, redisClient: RedisClientType) {
  const verificationDatabase = new VerificationDatabase(db);

  const usersService = new services.UsersService(db, redisClient);
  const userController = new controllers.UserController(usersService);
  const usersRoute = new routes.UsersRoute(userController);

  const postsService = new services.PostsService(db);
  const postsController = new controllers.PostController(postsService, verificationDatabase);
  const postsRoute = new routes.PostsRoute(postsController);

  const commentsService = new services.CommentsService(db);
  const commentsController = new controllers.CommentController(commentsService, verificationDatabase);
  const commentsRoute = new routes.CommentsRoute(commentsController);


  return {
    usersRoute,
    postsRoute,
    commentsRoute,
  };
}
