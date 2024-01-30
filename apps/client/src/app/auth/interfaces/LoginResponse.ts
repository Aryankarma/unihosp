import { UserResponse } from '@unihosp/api-interface';

export interface LoginResponse {
  message: string;
  data: {
    user: UserResponse;
  };
}
