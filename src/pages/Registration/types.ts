export type UserRole = 'teacher' | 'student' | 'parent';

export interface RegisterApiReq {
  email: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  patronym: string;
  specialization?: string;
  phone?: string;
  hire_date?: string;
  birth_date?: string;
  parent_id?: number;
}

export interface RegisterApiRes {
  success: boolean;
  token: string;
}
