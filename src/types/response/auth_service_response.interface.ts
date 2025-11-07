export interface IVerifyUserResponse {
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
  user_id: string;
  user_email: string;
}

export interface IEmailCodeResponse {
  message: string;
  user_id?: string;
}

export interface ITokenResponse {
  token: string;
}
export interface IMessageResponse {
  message: string;
}
export interface IAccessTokenResponse {
  access_token: string;
}
