export interface AuthMeResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
  
    email: string;
    first_name: string;
    last_name: string;
    patronym: string;
  
    phone: string | null;
    birth_date: string | null;
  
    role: "student" | "teacher" | "parent" | "admin" | "accountant";
    is_active: boolean;
  
    group_id: number | null;
    parent_id: number | null;
    student_id: number | null;
    teacher_id: number | null;
    parent: unknown | null; // or a specific Parent type if you have it
  
    tuition_fee_id: number | null;
  
    created_at: string;
    updated_at: string;
    children?: {
      id: number;
      user_id: number;
      first_name: string;
      last_name: string;
      patronym: string;
      birth_date: string; // ISO date string, e.g. "2008-02-23"
      created_at: string; // ISO timestamp
      updated_at: string; // ISO timestamp
      group_id: number | null;
      parent_id: number | null;
      tuition_fee_id: number | null;
      phone: string;
      average_grade: number;
    }[]
  }
}
