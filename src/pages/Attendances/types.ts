export interface FindAttendanceRequestDto {
  group_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface AttendanceItemDto {
  id: number;
  student_id: number;
  lesson_id: number;
  attended: boolean;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
    group_id: number | null;
  };
  lesson?: {
    id: number;
    course_id: number;
    teacher_id: number;
    lesson_date: Date;
    start_time: string | null;
    end_time: string | null;
    topic: string | null;
  };
}

export interface FindAttendanceResponseDto {
  data:{
    attendances: AttendanceItemDto[];
    count: number;
    attendedCount: number;
    notAttendedCount: number;
  }

}

export interface CreateAttendanceRequestDto {
  student_id: number;
  lesson_id: number;
  attended?: boolean;
}

export interface CreateAttendanceResponseDto {
  id: number;
  student_id: number;
  lesson_id: number;
  attended: boolean;
}
