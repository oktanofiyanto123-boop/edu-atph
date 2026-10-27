-- ====================================================================
-- EDU-ATPH LMS DATABASE SCHEMA & MIGRATION SCRIPT
-- Platform: EduATPH (Agribisnis Tanaman Pangan dan Hortikultura)
-- Administrator: Okta Nofiyanto
-- Target: Supabase PostgreSQL with Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('belum_dikerjakan', 'draft', 'sudah_dikumpulkan', 'terlambat', 'sudah_dinilai');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE material_status AS ENUM ('published', 'draft', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Terkoneksi dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  nisn VARCHAR(20) UNIQUE,
  class_id UUID,
  major TEXT DEFAULT 'Agribisnis Tanaman Pangan dan Hortikultura',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  grade_level VARCHAR(5) NOT NULL CHECK (grade_level IN ('X', 'XI', 'XII')),
  description TEXT,
  academic_year VARCHAR(20) NOT NULL DEFAULT '2025/2026',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Foreign key link from profiles to classes
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS fk_profiles_class,
  ADD CONSTRAINT fk_profiles_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. MATERIAL CATEGORIES TABLE (15 Kategori ATPH)
CREATE TABLE IF NOT EXISTS public.material_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(50) DEFAULT 'Sprout',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TEACHING MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.teaching_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.material_categories(id) ON DELETE RESTRICT,
  target_class_id VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all' or class UUID
  topic TEXT NOT NULL,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  pdf_url TEXT,
  order_index INT NOT NULL DEFAULT 0,
  status material_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. MATERIAL ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.material_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.teaching_materials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size VARCHAR(20),
  file_type VARCHAR(20) DEFAULT 'pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. LEARNING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.teaching_materials(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  CONSTRAINT unique_student_material UNIQUE (student_id, material_id)
);

-- 10. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  target_class_id VARCHAR(50) NOT NULL DEFAULT 'all',
  topic TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  due_date TIMESTAMPTZ NOT NULL,
  submission_type VARCHAR(30) NOT NULL DEFAULT 'text_and_file',
  points INT NOT NULL DEFAULT 100,
  rubric_criteria JSONB DEFAULT '[]'::jsonb,
  attachment_url TEXT,
  attachment_name TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text_content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size VARCHAR(20),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status submission_status NOT NULL DEFAULT 'sudah_dikumpulkan',
  grade NUMERIC(5,2),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

-- 12. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  target_class_id VARCHAR(50) NOT NULL DEFAULT 'all',
  topic TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  max_attempts INT NOT NULL DEFAULT 1,
  passing_score INT NOT NULL DEFAULT 75,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'multiple_choice',
  options JSONB, -- [ { "id": "A", "text": "..." }, ... ]
  correct_answer TEXT NOT NULL, -- "A" or "true"
  explanation TEXT,
  points INT NOT NULL DEFAULT 10,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(5,2) NOT NULL DEFAULT 100,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempt_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. GRADES TABLE (Rekap Nilai)
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  assignment_average NUMERIC(5,2) NOT NULL DEFAULT 0,
  quiz_average NUMERIC(5,2) NOT NULL DEFAULT 0,
  final_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Belum Tuntas',
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_student_grade UNIQUE (student_id, class_id)
);

-- 16. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_class_id VARCHAR(50) NOT NULL DEFAULT 'all',
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  is_published BOOLEAN NOT NULL DEFAULT true,
  author_name TEXT NOT NULL DEFAULT 'Okta Nofiyanto',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone authenticated can read profiles; users can update own profile; admin full access
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Classes & Categories: Authenticated users can read; Admin can insert/update/delete
CREATE POLICY "Anyone read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admin manage classes" ON public.classes FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone read categories" ON public.material_categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.material_categories FOR ALL USING (public.is_admin());

-- Teaching Materials: Published materials visible to all, drafts only to admin
CREATE POLICY "Read published materials" ON public.teaching_materials FOR SELECT 
  USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admin manage materials" ON public.teaching_materials FOR ALL USING (public.is_admin());

-- Learning Progress: Students manage own progress; Admin read all
CREATE POLICY "Students manage own progress" ON public.learning_progress 
  FOR ALL USING (auth.uid() = student_id OR public.is_admin());

-- Assignments: Published visible to students; Admin manage all
CREATE POLICY "Students read assignments" ON public.assignments FOR SELECT 
  USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admin manage assignments" ON public.assignments FOR ALL USING (public.is_admin());

-- Submissions: Students insert and view their own; Admin manage all
CREATE POLICY "Students view own submissions" ON public.submissions FOR SELECT 
  USING (auth.uid() = student_id OR public.is_admin());
CREATE POLICY "Students insert own submissions" ON public.submissions FOR INSERT 
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own submission before graded" ON public.submissions FOR UPDATE 
  USING (auth.uid() = student_id AND status != 'sudah_dinilai');
CREATE POLICY "Admin manage all submissions" ON public.submissions FOR ALL USING (public.is_admin());

-- Quizzes: Published visible; Admin manage all
CREATE POLICY "Students view published quizzes" ON public.quizzes FOR SELECT 
  USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin());

-- Quiz Questions: Students can read questions during quiz; Admin manage all
CREATE POLICY "Students view questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admin manage questions" ON public.quiz_questions FOR ALL USING (public.is_admin());

-- Quiz Attempts: Students manage own attempts; Admin read all
CREATE POLICY "Students view and insert attempts" ON public.quiz_attempts 
  FOR ALL USING (auth.uid() = student_id OR public.is_admin());

-- Grades: Students view own; Admin manage all
CREATE POLICY "Students view own grades" ON public.grades FOR SELECT 
  USING (auth.uid() = student_id OR public.is_admin());
CREATE POLICY "Admin manage grades" ON public.grades FOR ALL USING (public.is_admin());

-- Announcements: Viewable if published; Admin manage all
CREATE POLICY "Students view announcements" ON public.announcements FOR SELECT 
  USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- ====================================================================
-- SEED DATA: 15 KATEGORI ATPH & KELAS PERCONTOHAN
-- ====================================================================
INSERT INTO public.classes (name, grade_level, description, academic_year) VALUES
  ('X ATPH', 'X', 'Kelas 10 Agribisnis Tanaman Pangan dan Hortikultura', '2025/2026'),
  ('XI ATPH', 'XI', 'Kelas 11 Agribisnis Tanaman Pangan dan Hortikultura', '2025/2026'),
  ('XII ATPH', 'XII', 'Kelas 12 Agribisnis Tanaman Pangan dan Hortikultura', '2025/2026')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.material_categories (name, slug, description, icon_name, order_index) VALUES
  ('Dasar-Dasar Agribisnis Tanaman', 'dasar-dasar-agribisnis-tanaman', 'Pengenalan prinsip, ekologi pertanian, dan keselamatan kerja', 'BookOpen', 1),
  ('Penyiapan Media Tanam', 'penyiapan-media-tanam', 'Teknik pengolahan tanah, pencampuran kompos, arang sekam, dan cocopeat', 'Layers', 2),
  ('Penyiapan Benih dan Bibit', 'penyiapan-benih-dan-bibit', 'Seleksi benih bermutu, perlakuan benih (seed treatment), dan uji daya kecambah', 'CheckCircle', 3),
  ('Pembibitan Tanaman', 'pembibitan-tanaman', 'Teknik persemaian tray, sungkup plastik, dan pemeliharaan bibit muda', 'Sprout', 4),
  ('Budidaya Tanaman Pangan', 'budidaya-tanaman-pangan', 'Teknologi budidaya padi sawah, jagung hibrida, kedelai, dan ubi jalar', 'Wheat', 5),
  ('Budidaya Tanaman Hortikultura', 'budidaya-tanaman-hortikultura', 'Budidaya sayuran daun, sayuran buah, tanaman hias, dan tanaman obat', 'Apple', 6),
  ('Pertanian Lahan Basah', 'pertanian-lahan-basah', 'Pengelolaan irigasi teknis, pasang surut, dan budidaya sawah intensif', 'Droplets', 7),
  ('Pertanian Lahan Kering', 'pertanian-lahan-kering', 'Teknik konservasi air tanah, mulsa, dan budidaya tanaman palawija', 'Sun', 8),
  ('Sistem Hidroponik', 'sistem-hidroponik', 'Nutrient Film Technique (NFT), Deep Flow Technique (DFT), dan fertigasi tetes', 'Pipette', 9),
  ('Pemeliharaan Tanaman', 'pemeliharaan-tanaman', 'Penyulaman, penyiangan gulma, pemangkasan (pruning), dan pemasangan ajir', 'Scissors', 10),
  ('Pemupukan', 'pemupukan', 'Prinsip 5T pemupukan, pupuk organik cair (POC), dan pupuk anorganik berimbang', 'FlaskConical', 11),
  ('Pengendalian Hama dan Penyakit Tanaman', 'pengendalian-hama-penyakit', 'Pengendalian Hama Terpadu (PHT), pestisida nabati, dan musuh alami', 'ShieldAlert', 12),
  ('Panen dan Pascapanen', 'panen-dan-pascapanen', 'Kriteria matang panen, sortasi, grading, pengemasan, dan rantai dingin', 'PackageCheck', 13),
  ('Keselamatan dan Kesehatan Kerja Pertanian', 'k3-pertanian', 'Standar APD pertanian, ergonomi kerja di kebun, dan penanganan bahan kimia', 'HardHat', 14),
  ('Agripreneurship', 'agripreneurship', 'Analisis usaha tani, pemasaran digital hasil panen, dan pembukuan agribisnis', 'TrendingUp', 15)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subjects (code, name, description) VALUES
  ('ATPH-01', 'Agribisnis Tanaman Pangan dan Hortikultura', 'Kompetensi keahlian kejuruan pertanian modern SMK')
ON CONFLICT (code) DO NOTHING;
