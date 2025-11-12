import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthenticationFailLog } from '../user_authentication_fail_log/entities/user_authentication_fail_log.entity';
import {
  AuthStatus,
  UserAuthentication,
} from '../user_authentication/entities/user_authentication.entity';
import { LoginNoteType } from '../../types/auth/auth_helper.interface';
import { LOGIN_NOTE } from '../../common/const/login_history_note.const';
import { UserLoginHistoryService } from '../user_login_history/user_login_history.service';
import { CreateUserLoginHistoryDto } from '../user_login_history/dto/create-user_login_history.dto';

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
    private readonly loginHistoryService: UserLoginHistoryService,
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

  async savelogLoginHistory(
    data: CreateUserLoginHistoryDto,
    type: LoginNoteType,
  ) {
    const typeToNoteMap: Record<LoginNoteType, string> = {
      success: LOGIN_NOTE.SUCCESS,
      password: LOGIN_NOTE.INVALID_PASSWORD,
      deleted: LOGIN_NOTE.ACCOUNT_DELETED,
      pending_verification: LOGIN_NOTE.NOT_VERIFIED,
      blocked: LOGIN_NOTE.ACCOUNT_BLOCKED,
      disabled: LOGIN_NOTE.ACCOUNT_DISABLED,
      too_many_attempts: LOGIN_NOTE.TOO_MANY_ATTEMPTS,
    };

    const note = typeToNoteMap[type] || LOGIN_NOTE.UNKNOWN_ERROR;

    return await this.loginHistoryService.create({
      ...data,
      note,
    });
  }
}
