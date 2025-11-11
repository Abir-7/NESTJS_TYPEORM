import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthenticationFailLog } from '../user/user_authentication_fail_log/entities/user_authentication_fail_log.entity';
import {
  AuthStatus,
  UserAuthentication,
} from '../user/user_authentication/entities/user_authentication.entity';

interface LogAndThrowOptions {
  user_id: string;
  user_auth_id: string;
  code?: string;
  reason: string;
  type?: 'EXPIRED';
  ip_address?: string;
  user_agent?: string;
  token?: string;
}

@Injectable()
export class AuthUtils {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserAuthenticationFailLog)
    private readonly failLogRepo: Repository<UserAuthenticationFailLog>,
    @InjectRepository(UserAuthentication)
    private readonly authRepository: Repository<UserAuthentication>,
  ) {}

  async logAndThrow(options: LogAndThrowOptions) {
    const { user_id, user_auth_id, type, ...rest } = options;

    await this.dataSource.transaction(async (manager) => {
      const failLog = manager.create(UserAuthenticationFailLog, {
        user: { id: user_id },
        authentication: { id: user_auth_id },
        ...rest,
      });
      await manager.save(failLog);

      if (type === 'EXPIRED' && user_auth_id) {
        console.log('hit');
        const update = manager.update(
          UserAuthentication,
          { id: user_auth_id },
          {
            status: AuthStatus.EXPIRED,
          },
        );
        await manager.save(update);
      }
    });

    throw new HttpException(rest.reason, HttpStatus.BAD_REQUEST);
  }

  async makePriviousCodeCanceled(user_auth_id: string) {
    await this.authRepository.update(
      { id: user_auth_id },
      { status: AuthStatus.CANCELLED },
    );
  }
}
