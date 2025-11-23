export interface SignInApiReq {
  email: string;
  password: string;
}

export interface SignInApiRes {
  success: boolean;
  token: string;
}
