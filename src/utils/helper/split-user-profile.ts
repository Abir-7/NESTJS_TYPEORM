/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateUserDto } from '../../module/auth/dto/create-user.dto';
import { CreateUserProfileDto } from '../../module/user/user_profile/dto/create-user_profile.dto';

interface SplitResult {
  user: CreateUserDto;
  profile: CreateUserProfileDto;
}

// Only allowed fields for each entity
const USER_FIELDS = ['email', 'password', 'role'];

const PROFILE_FIELDS = [
  'first_name',
  'last_name',
  'phone',
  'image',
  'image_id',
  'address',
  'city',
  'country',
  'zip_code',
  'date_of_birth',
];

export function splitUserProfile<T extends Record<string, any>>(
  data: T,
): SplitResult {
  const user: Partial<CreateUserDto> = {};
  const profile: Partial<CreateUserProfileDto> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (USER_FIELDS.includes(key)) {
      user[key] = value;
    } else if (PROFILE_FIELDS.includes(key)) {
      profile[key] = value;
    }
    // Skip any other fields automatically
  });

  return {
    user: user as CreateUserDto,
    profile: profile as CreateUserProfileDto,
  };
}
