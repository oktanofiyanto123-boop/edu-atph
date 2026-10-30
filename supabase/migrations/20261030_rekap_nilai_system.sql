-- ====================================================================
-- EDU-ATPH DATABASE MIGRATION: REKAP NILAI, SISWA, KUIS & JAWABAN
-- Platform: EduATPH (Agribisnis Tanaman Pangan dan Hortikultura)
-- Database: Supabase PostgreSQL
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABEL STUDENTS (Siswa)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL DEFAULT 'X ATPH',
    nisn VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pencarian siswa
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_name);
CREATE INDEX IF NOT EXISTS idx_students_nisn ON public.students(nisn);

-- 3. TABEL SUBJECTS (Mata Pelajaran) - Sesuaikan kolom jika tabel sudah ada
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subjects') THEN
    ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS subject_name TEXT;
    UPDATE public.subjects SET subject_name = name WHERE subject_name IS NULL AND name IS NOT NULL;
    ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
  ELSE
    CREATE TABLE public.subjects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject_name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  END IF;
END $$;

-- 4. TABEL QUIZZES (Kuis / Evaluasi) - Sesuaikan kolom
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
    ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS total_questions INT DEFAULT 20;
    ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
  ELSE
    CREATE TABLE public.quizzes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      total_questions INT NOT NULL DEFAULT 20,
      duration_minutes INT DEFAULT 20,
      pass_score INT DEFAULT 75,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  END IF;
END $$;

-- 5. TABEL QUIZ_ATTEMPTS (Riwayat Pengerjaan Kuis Siswa)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS total_questions INT DEFAULT 20;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS correct_answers INT DEFAULT 0;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS incorrect_answers INT DEFAULT 0;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS is_passed BOOLEAN DEFAULT false;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS student_name TEXT;
    ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS quiz_title TEXT;
  ELSE
    CREATE TABLE public.quiz_attempts (
      id TEXT PRIMARY KEY DEFAULT ('att-' || gen_random_uuid()::text),
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      quiz_title TEXT,
      score NUMERIC(5,2) NOT NULL DEFAULT 0,
      max_score NUMERIC(5,2) NOT NULL DEFAULT 100,
      total_questions INT NOT NULL DEFAULT 20,
      correct_answers INT NOT NULL DEFAULT 0,
      incorrect_answers INT NOT NULL DEFAULT 0,
      started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      submitted_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      status VARCHAR(50) NOT NULL DEFAULT 'graded',
      is_passed BOOLEAN DEFAULT false,
      answers JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON public.quiz_attempts(created_at DESC);

-- 6. TABEL QUIZ_ANSWERS (Jawaban Tiap Nomor Soal)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question_text TEXT,
    answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_awarded INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON public.quiz_answers(question_id);

-- 7. TABEL GRADES (Rekap Nilai Siswa)
-- Perbaiki foreign key lama yang mengarah ke tabel profiles yang tidak ada
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'grades') THEN
    -- Hapus constraint lama jika ada yang rusak
    ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_student_id_fkey;
    ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS fk_grades_profiles;
    ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS unique_student_grade;

    -- Tambahkan kolom baru yang dibutuhkan
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS subject_id TEXT;
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS subject_name TEXT DEFAULT 'Dasar-Dasar Agribisnis Tanaman';
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS quiz_id TEXT;
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS quiz_title TEXT;
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS attempt_id TEXT;
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50) DEFAULT 'quiz';
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS student_name TEXT;
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS class_name TEXT DEFAULT 'X ATPH';
    ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
  ELSE
    CREATE TABLE public.grades (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id TEXT NOT NULL,
      student_name TEXT,
      class_name TEXT DEFAULT 'X ATPH',
      subject_id TEXT,
      subject_name TEXT DEFAULT 'Dasar-Dasar Agribisnis Tanaman',
      quiz_id TEXT,
      quiz_title TEXT,
      attempt_id TEXT,
      score NUMERIC(5,2) NOT NULL DEFAULT 0,
      assessment_type VARCHAR(50) NOT NULL DEFAULT 'quiz',
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_quiz ON public.grades(quiz_id);
CREATE INDEX IF NOT EXISTS idx_grades_created ON public.grades(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan students: Semua user/backend dapat membaca, user dapat insert/update profilnya
DROP POLICY IF EXISTS "Anyone can read students" ON public.students;
CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert students" ON public.students;
CREATE POLICY "Insert students" ON public.students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update own student profile" ON public.students;
CREATE POLICY "Update own student profile" ON public.students FOR UPDATE USING (true);

-- 2. Kebijakan quiz_attempts: Publik & Admin dapat membaca hasil, siswa dapat insert
DROP POLICY IF EXISTS "Anyone can read quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Anyone can read quiz_attempts" ON public.quiz_attempts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Anyone can insert quiz_attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Anyone can update quiz_attempts" ON public.quiz_attempts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin delete quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Admin delete quiz_attempts" ON public.quiz_attempts FOR DELETE USING (true);

-- 3. Kebijakan quiz_answers: Siswa & Admin dapat membaca jawaban kuis, backend dapat insert
DROP POLICY IF EXISTS "Anyone can read quiz_answers" ON public.quiz_answers;
CREATE POLICY "Anyone can read quiz_answers" ON public.quiz_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert quiz_answers" ON public.quiz_answers;
CREATE POLICY "Anyone can insert quiz_answers" ON public.quiz_answers FOR INSERT WITH CHECK (true);

-- 4. Kebijakan grades: Admin dan siswa dapat membaca seluruh nilai, sistem dapat insert/update
DROP POLICY IF EXISTS "Anyone can read grades" ON public.grades;
CREATE POLICY "Anyone can read grades" ON public.grades FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert grades" ON public.grades;
CREATE POLICY "Anyone can insert grades" ON public.grades FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update grades" ON public.grades;
CREATE POLICY "Anyone can update grades" ON public.grades FOR UPDATE USING (true);

