import {Injectable} from '@nestjs/common';

import {UserService} from '../user/user.service';
// import {LoginRequestDto} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  //   async login(loginDto: LoginRequestDto): Promise<{access_token: string}> {
  //     const {username, password} = loginDto;

  //     const user = await this.userService.findByUsername(username, {
  //       includePassword: true,
  //       disableThrowError: true,
  //     });

  //     if (!user) {
  //       throw loginError;
  //     }

  //     const isMatch = await compare(password, user.password);

  //     if (!isMatch) {
  //       throw loginError;
  //     }

  //     return {
  //       access_token: this.generateJwtToken(user),
  //     };
  //   }
}
