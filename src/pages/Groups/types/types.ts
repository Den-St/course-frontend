export interface CreateGroupRequestDto {
  name: string;
  grade_level: number;
  start_year?: number;
  curator_id?: number;
}

export interface FilterGroupsRequestDto {
  name?: string;
  grade_level?: number;
  start_year?: number;
  curator_id?: number;
}

export interface GroupResponseDto {
  id: number;
  name: string;
  grade_level: number;
  start_year: number;
  curator_id: number | null;
  curator_name: string | null;
  student_count: number;
}

export interface CreateGroupResponseDto extends GroupResponseDto {}

export interface FilterGroupsResponseDto {
  groups: GroupResponseDto[];
}
