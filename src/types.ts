export interface CoursesResponse {
  courses: Course[];
}

interface Base {
  id: string;
  title: string;
  duration: number;
  previewImageLink: string;
}

export interface Course extends Base {
  tags: Tag[];
  launchDate: string;
  status: CourseStatus;
  description: string;
  lessonsCount: number;
  rating: number;
  meta: CourseMeta;
  lessons: Lesson[];
  containsLockedLessons: boolean;
}

export interface Lesson extends Base {
  order: number;
  type: Type;
  status: LessonStatus;
  link?: string;
  meta: LessonMeta | null;
}

export interface CourseProgress {
  currentVideo: number;
  watchedVideos: Set<number>;
}

export interface LessonMeta {
  difficulty: Difficulty;
}

export type Difficulty = "medium" | "easy" | "hard";

export type LessonStatus = "unlocked" | "locked";

export type Type = "video" | "quiz_simulator" | "article";

export interface CourseMeta {
  slug: string;
  skills?: string[];
  courseVideoPreview?: CourseVideoPreview;
  fullCourseProductID?: string;
  fullCourseProductFamily?: string;
}

export interface CourseVideoPreview {
  link: string;
  duration: number;
  previewImageLink: string;
}

export type CourseStatus = "launched";

export type Tag =
  | "productivity"
  | "learning ability"
  | "communication"
  | "psychology";

export type GenCourseTileProps = {
  course: Course;
};

export type GenLessonListItemProps = {
  duration: number;
  title: string;
  link: string;
  locked: boolean;
  watched: boolean;
  active: boolean;
};
