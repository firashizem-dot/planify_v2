export type UserRole = 'ADMIN' | 'DEPARTMENT_HEAD' | 'PROFESSOR' | 'STUDENT';
export type CourseType = 'CI' | 'TD' | 'TP';
export type ClassroomType = 'AMPHITHEATER' | 'TD_ROOM' | 'LABORATORY';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
export type ScheduleStatus = 'DRAFT' | 'GENERATED' | 'VALIDATED' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: number;
  departmentName?: string;
  enabled: boolean;
  twoFactorEnabled: boolean;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  headId?: number;
  headName?: string;
}

export interface Professor {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  departmentName: string;
  specialization?: string;
  maxHoursPerWeek: number;
  subjectIds?: number[];
  subjectNames?: string[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  departmentName: string;
  courseType: CourseType;
  hoursPerWeek: number;
  level?: string;
  semester?: string;
  description?: string;
}

export interface Classroom {
  id: number;
  name: string;
  code: string;
  type: ClassroomType;
  capacity: number;
  departmentId?: number;
  departmentName?: string;
  equipment?: string;
}

export interface StudentGroup {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  departmentName: string;
  level?: string;
  studentCount: number;
}

export interface TimeSlot {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  departmentId: number;
}

export interface Student {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  studentGroupId: number;
  studentGroupName: string;
  groupLevel?: string;
}

export interface ProfessorPreference {
  id: number;
  professorId: number;
  timeSlotId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  id: number;
  departmentId: number;
  departmentName: string;
  semester: string;
  academicYear: string;
  status: ScheduleStatus;
  hardScore: number;
  softScore: number;
  solveDurationMs?: number;
  constraintViolations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSession {
  id: number;
  scheduleId: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  courseType: CourseType;
  professorId: number;
  professorName: string;
  classroomId: number;
  classroomName: string;
  classroomCode: string;
  studentGroupId: number;
  studentGroupName: string;
  timeSlotId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface LoginResponse {
  token?: string;
  email: string;
  fullName?: string;
  role?: UserRole;
  departmentId?: number;
  twoFactorRequired: boolean;
  twoFactorEnabled: boolean;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
}

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  CI: 'Cours Intégré',
  TD: 'Travaux Dirigés',
  TP: 'Travaux Pratiques',
};

export const CLASSROOM_TYPE_LABELS: Record<ClassroomType, string> = {
  AMPHITHEATER: 'Amphithéâtre',
  TD_ROOM: 'Salle TD',
  LABORATORY: 'Laboratoire',
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
};

export const DAYS_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const COURSE_TYPE_COLORS: Record<CourseType, string> = {
  CI: 'bg-blue-100 text-blue-800 border-blue-200',
  TD: 'bg-green-100 text-green-800 border-green-200',
  TP: 'bg-purple-100 text-purple-800 border-purple-200',
};
