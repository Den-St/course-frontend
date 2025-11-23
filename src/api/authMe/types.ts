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
  
    role: "student" | "teacher" | "parent" | "admin";
    is_active: boolean;
  
    group_id: number | null;
    parent_id: number | null;
    parent: unknown | null; // or a specific Parent type if you have it
  
    tuition_fee_id: number | null;
  
    created_at: string;
    updated_at: string;
  }
}
