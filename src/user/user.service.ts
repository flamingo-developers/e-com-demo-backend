import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import genJwt from 'src/shared/utils/gen-jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepo } from './user.repo';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userRepo.create(createUserDto);
    return await genJwt({ email: createdUser.email });
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.getUserByEmail(email);
    if (user === null)
      throw new NotFoundException(`user with email ${email} does not exist`);
    return user;
  }

  async getUserPasswordByEmail(email: string): Promise<string> {
    const password = await this.userRepo.getUserPasswordByEmail(email);

    if (password === null)
      throw new InternalServerErrorException(`something went wrong`);
    return password;
  }
}
