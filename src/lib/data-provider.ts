'use client';

import {
  UserProfile,
  ClassItem,
  MaterialCategory,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  GradeRecord,
  Announcement,
  DashboardStats,
  LearningProgress,
} from '@/types';
import {
  INITIAL_CLASSES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
} from './mock-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'eduatph_current_user',
  CLASSES: 'eduatph_classes',
  CATEGORIES: 'eduatph_categories',
  USERS: 'eduatph_users',
  MATERIALS: 'eduatph_materials',
  ASSIGNMENTS: 'eduatph_assignments',
  SUBMISSIONS: 'eduatph_submissions',
  QUIZZES: 'eduatph_quizzes',
  QUIZ_QUESTIONS: 'eduatph_quiz_questions',
  QUIZ_ATTEMPTS: 'eduatph_quiz_attempts',
  GRADES: 'eduatph_grades',
  ANNOUNCEMENTS: 'eduatph_announcements',
  PROGRESS: 'eduatph_progress',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}

export const DataProvider = {
  // --- AUTH & USERS ---
  getCurrentUser(): UserProfile {
    return getItem<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default: Okta Nofiyanto (Admin)
  },

  setCurrentUser(user: UserProfile): void {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  login(email: string, role?: 'admin' | 'student'): UserProfile | null {
    const users = this.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    // Quick role login fallback
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      this.setCurrentUser(admin);
      return admin;
    }
    if (role === 'student') {
      const student = users.find((u) => u.role === 'student') || INITIAL_USERS[1];
      this.setCurrentUser(student);
      return student;
    }
    return null;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers(): UserProfile[] {
    return getItem<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  addUser(user: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
    const users = this.getUsers();
    const newUser: UserProfile = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    setItem(STORAGE_KEYS.USERS, users);

    // Update current user if matching
    const currentUser = this.getCurrentUser();
    if (currentUser.id === id) {
      this.setCurrentUser(users[index]);
    }
    return users[index];
  },

  toggleUserStatus(id: string): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;
    user.isActive = !user.isActive;
    setItem(STORAGE_KEYS.USERS, users);
    return true;
  },

  // --- CLASSES ---
  getClasses(): ClassItem[] {
    return getItem<ClassItem[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  addClass(cls: Omit<ClassItem, 'id' | 'createdAt'>): ClassItem {
    const classes = this.getClasses();
    const newClass: ClassItem = {
      ...cls,
      id: `cls-${Date.now()}`,
      createdAt: new Date().toISOString(),
      studentCount: 0,
    };
    classes.push(newClass);
    setItem(STORAGE_KEYS.CLASSES, classes);
    return newClass;
  },

  updateClass(id: string, updates: Partial<ClassItem>): ClassItem | null {
    const classes = this.getClasses();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) return null;
    classes[index] = { ...classes[index], ...updates };
    setItem(STORAGE_KEYS.CLASSES, classes);
    return classes[index];
  },

  deleteClass(id: string): boolean {
    let classes = this.getClasses();
    classes = classes.filter((c) => c.id !== id);
    setItem(STORAGE_KEYS.CLASSES, classes);
    return true;
  },

  // --- CATEGORIES ---
  getCategories(): MaterialCategory[] {
    return getItem<MaterialCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  addCategory(cat: Omit<MaterialCategory, 'id'>): MaterialCategory {
    const categories = this.getCategories();
    const newCat: MaterialCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCat);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<MaterialCategory>): MaterialCategory | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },

  deleteCategory(id: string): boolean {
    let categories = this.getCategories();
    categories = categories.filter((c) => c.id !== id);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  },

  // --- MATERIALS ---
  getMaterials(): TeachingMaterial[] {
    return getItem<TeachingMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  },

  getMaterialById(id: string): TeachingMaterial | undefined {
    return this.getMaterials().find((m) => m.id === id || m.slug === id);
  },

  addMaterial(mat: Omit<TeachingMaterial, 'id' | 'createdAt' | 'updatedAt'>): TeachingMaterial {
    const materials = this.getMaterials();
    const newMat: TeachingMaterial = {
      ...mat,
      id: `mat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    materials.unshift(newMat);
    setItem(STORAGE_KEYS.MATERIALS, materials);
    return newMat;
  },

  updateMaterial(id: string, updates: Partial<TeachingMaterial>): TeachingMaterial | null {
    const materials = this.getMaterials();
    const index = materials.findIndex((m) => m.id === id);
    if (index === -1) return null;
    materials[index] = {
      ...materials[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.MATERIALS, materials);
    return materials[index];
  },

  deleteMaterial(id: string): boolean {
    let materials = this.getMaterials();
    materials = materials.filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.MATERIALS, materials);
    return true;
  },

  // --- PROGRESS ---
  getProgress(): LearningProgress[] {
    return getItem<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
  },

  markMaterialCompleted(studentId: string, materialId: string): void {
    const progressList = this.getProgress();
    const existing = progressList.find(
      (p) => p.studentId === studentId && p.materialId === materialId
    );
    if (existing) {
      existing.completed = true;
      existing.completedAt = new Date().toISOString();
      existing.lastAccessedAt = new Date().toISOString();
    } else {
      progressList.push({
        id: `prog-${Date.now()}`,
        studentId,
        materialId,
        completed: true,
        lastAccessedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
    }
    setItem(STORAGE_KEYS.PROGRESS, progressList);
  },

  isMaterialCompleted(studentId: string, materialId: string): boolean {
    return this.getProgress().some(
      (p) => p.studentId === studentId && p.materialId === materialId && p.completed
    );
  },

  // --- ASSIGNMENTS ---
  getAssignments(): Assignment[] {
    return getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },

  getAssignmentById(id: string): Assignment | undefined {
    return this.getAssignments().find((a) => a.id === id);
  },

  addAssignment(asg: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
    const assignments = this.getAssignments();
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    assignments.unshift(newAsg);
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return newAsg;
  },

  updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const assignments = this.getAssignments();
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    assignments[index] = { ...assignments[index], ...updates };
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignments[index];
  },

  deleteAssignment(id: string): boolean {
    let assignments = this.getAssignments();
    assignments = assignments.filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return true;
  },

  // --- SUBMISSIONS ---
  getSubmissions(): Submission[] {
    return getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },

  getSubmissionsByAssignment(assignmentId: string): Submission[] {
    return this.getSubmissions().filter((s) => s.assignmentId === assignmentId);
  },

  getStudentSubmission(studentId: string, assignmentId: string): Submission | undefined {
    return this.getSubmissions().find(
      (s) => s.studentId === studentId && s.assignmentId === assignmentId
    );
  },

  submitAssignment(data: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Submission {
    const submissions = this.getSubmissions();
    const existingIndex = submissions.findIndex(
      (s) => s.studentId === data.studentId && s.assignmentId === data.assignmentId
    );

    const newSub: Submission = {
      ...data,
      id: existingIndex !== -1 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'sudah_dikumpulkan',
    };

    if (existingIndex !== -1) {
      submissions[existingIndex] = newSub;
    } else {
      submissions.unshift(newSub);
    }
    setItem(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newSub;
  },

  gradeSubmission(id: string, grade: number, feedback: string, graderName: string = 'Okta Nofiyanto'): Submission | null {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) return null;
    submissions[index].grade = grade;
    submissions[index].feedback = feedback;
    submissions[index].status = 'sudah_dinilai';
    submissions[index].gradedAt = new Date().toISOString();
    submissions[index].gradedBy = graderName;
    setItem(STORAGE_KEYS.SUBMISSIONS, submissions);

    // Update gradebook record
    this.recalculateStudentGrade(submissions[index].studentId);
    return submissions[index];
  },

  // --- QUIZZES ---
  getQuizzes(): Quiz[] {
    return getItem<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },

  getQuizById(id: string): Quiz | undefined {
    return this.getQuizzes().find((q) => q.id === id);
  },

  addQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
    const quizzes = this.getQuizzes();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    quizzes.unshift(newQuiz);
    setItem(STORAGE_KEYS.QUIZZES, quizzes);
    return newQuiz;
  },

  updateQuiz(id: string, updates: Partial<Quiz>): Quiz | null {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex((q) => q.id === id);
    if (index === -1) return null;
    quizzes[index] = { ...quizzes[index], ...updates };
    setItem(STORAGE_KEYS.QUIZZES, quizzes);
    return quizzes[index];
  },

  deleteQuiz(id: string): boolean {
    let quizzes = this.getQuizzes();
    quizzes = quizzes.filter((q) => q.id !== id);
    setItem(STORAGE_KEYS.QUIZZES, quizzes);
    return true;
  },

  // --- QUIZ QUESTIONS ---
  getQuizQuestions(quizId?: string): QuizQuestion[] {
    const questions = getItem<QuizQuestion[]>(STORAGE_KEYS.QUIZ_QUESTIONS, INITIAL_QUIZ_QUESTIONS);
    if (quizId) {
      return questions.filter((q) => q.quizId === quizId);
    }
    return questions;
  },

  addQuizQuestion(question: Omit<QuizQuestion, 'id'>): QuizQuestion {
    const questions = this.getQuizQuestions();
    const newQ: QuizQuestion = {
      ...question,
      id: `q-${Date.now()}`,
    };
    questions.push(newQ);
    setItem(STORAGE_KEYS.QUIZ_QUESTIONS, questions);
    return newQ;
  },

  deleteQuizQuestion(id: string): boolean {
    let questions = this.getQuizQuestions();
    questions = questions.filter((q) => q.id !== id);
    setItem(STORAGE_KEYS.QUIZ_QUESTIONS, questions);
    return true;
  },

  // --- QUIZ ATTEMPTS ---
  getQuizAttempts(studentId?: string, quizId?: string): QuizAttempt[] {
    let attempts = getItem<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, INITIAL_QUIZ_ATTEMPTS);
    if (studentId) attempts = attempts.filter((a) => a.studentId === studentId);
    if (quizId) attempts = attempts.filter((a) => a.quizId === quizId);
    return attempts;
  },

  submitQuizAttempt(
    quizId: string,
    studentId: string,
    answers: { questionId: string; userAnswer: string }[]
  ): QuizAttempt {
    const quiz = this.getQuizById(quizId);
    const questions = this.getQuizQuestions(quizId);
    const user = this.getUsers().find((u) => u.id === studentId);

    let score = 0;
    let maxScore = 0;

    const evaluatedAnswers = answers.map((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      const points = q ? q.points : 20;
      maxScore += points;

      const isCorrect = q && ans.userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) {
        score += points;
      }
      return {
        questionId: ans.questionId,
        userAnswer: ans.userAnswer,
        isCorrect,
        pointsAwarded: isCorrect ? points : 0,
      };
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= (quiz?.passingScore || 75);

    const attempts = this.getQuizAttempts();
    const priorAttemptsCount = attempts.filter((a) => a.quizId === quizId && a.studentId === studentId).length;

    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId,
      quizTitle: quiz?.title || 'Kuis ATPH',
      studentId,
      studentName: user?.fullName || 'Siswa',
      className: user?.className || 'X ATPH',
      startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      completedAt: new Date().toISOString(),
      answers: evaluatedAnswers,
      score,
      maxScore,
      percentage,
      passed,
      attemptNumber: priorAttemptsCount + 1,
    };

    attempts.unshift(newAttempt);
    setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    // Recalculate student final grade
    this.recalculateStudentGrade(studentId);
    return newAttempt;
  },

  // --- GRADES ---
  getGrades(classId?: string): GradeRecord[] {
    const grades = getItem<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
    if (classId && classId !== 'all') {
      return grades.filter((g) => g.classId === classId);
    }
    return grades;
  },

  recalculateStudentGrade(studentId: string): void {
    const users = this.getUsers();
    const student = users.find((u) => u.id === studentId);
    if (!student) return;

    const submissions = this.getSubmissions().filter((s) => s.studentId === studentId && s.grade !== undefined);
    const attempts = this.getQuizAttempts(studentId);

    const avgAssignment = submissions.length
      ? Math.round(submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.length)
      : 80;

    const avgQuiz = attempts.length
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
      : 80;

    const finalScore = Math.round(avgAssignment * 0.6 + avgQuiz * 0.4);
    const status = finalScore >= 75 ? 'Tuntas' : 'Belum Tuntas';

    const grades = this.getGrades();
    const index = grades.findIndex((g) => g.studentId === studentId);

    const record: GradeRecord = {
      id: index !== -1 ? grades[index].id : `grd-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      nisn: student.nisn || '-',
      classId: student.classId || 'cls-10-atph',
      className: student.className || 'X ATPH',
      assignmentAverage: avgAssignment,
      quizAverage: avgQuiz,
      finalScore,
      status,
      notes: index !== -1 ? grades[index].notes : 'Perkembangan belajar aktif.',
    };

    if (index !== -1) {
      grades[index] = record;
    } else {
      grades.push(record);
    }
    setItem(STORAGE_KEYS.GRADES, grades);
  },

  // --- ANNOUNCEMENTS ---
  getAnnouncements(targetClassId?: string): Announcement[] {
    const list = getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (targetClassId && targetClassId !== 'all') {
      return list.filter((a) => a.targetClassId === 'all' || a.targetClassId === targetClassId);
    }
    return list;
  },

  addAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newAnn);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  },

  deleteAnnouncement(id: string): boolean {
    let list = this.getAnnouncements();
    list = list.filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return true;
  },

  // --- DASHBOARD STATS ---
  getDashboardStats(): DashboardStats {
    const students = this.getUsers().filter((u) => u.role === 'student');
    const classes = this.getClasses();
    const materials = this.getMaterials().filter((m) => m.status === 'published');
    const assignments = this.getAssignments().filter((a) => a.status === 'published');
    const submissions = this.getSubmissions();
    const pendingGrading = submissions.filter((s) => s.status === 'sudah_dikumpulkan');
    const grades = this.getGrades();

    const avg = grades.length
      ? Math.round(grades.reduce((acc, g) => acc + g.finalScore, 0) / grades.length)
      : 85;

    return {
      totalStudents: students.length,
      totalClasses: classes.length,
      totalMaterials: materials.length,
      totalActiveAssignments: assignments.length,
      totalSubmissions: submissions.length,
      pendingGradingCount: pendingGrading.length,
      averageGrade: avg,
      completionRate: 88,
    };
  },

  // Reset to initial mock data
  resetAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.MATERIALS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    this.setCurrentUser(INITIAL_USERS[0]);
  },
};
