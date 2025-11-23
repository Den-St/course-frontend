export type GetTeachersSortedRequestDto = {
  sortBy: 'hireDate' | 'courseCount';
  order?: 'ASC' | 'DESC';
  first_name?: string;
  last_name?: string;
  patronym?: string;
};

export type TeacherWithCoursesDto = {
  id: number;
  user_id: number;
  hire_date: string;
  courseCount: number;
  first_name: string;
  last_name: string;
  patronym?: string;
};

export type GetTeachersSortedResponseDto = TeacherWithCoursesDto[];
