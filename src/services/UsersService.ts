import { User } from "../types/entities/User";


export class UsersService {
  constructor() {}

  async createUser(userData: User): Promise<void> {

    console.log('UsersService.createUser()');
  }
}
