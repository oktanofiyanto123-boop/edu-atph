import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_QUIZZES, INITIAL_QUIZ_QUESTIONS } from '@/lib/mock-data';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngreirksuoraurufzftn.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Tj16Oq3f9BqbVj35Le-7bQ_avuh1PjD';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quizId,
      studentId,
      studentName,
      studentNisn,
      className,
      answers, // array of { questionId, userAnswer }
      startedAt,
    } = body;

    // 1. Validasi input
    if (!quizId) {
      return NextResponse.json({ error: 'ID Kuis tidak valid' }, { status: 400 });
    }
    if (!studentId || !studentName) {
      return NextResponse.json({ error: 'Siswa belum terautentikasi' }, { status: 401 });
    }

    // 2. Temukan quiz & pertanyaan resmi
    const quiz = INITIAL_QUIZZES.find((q) => q.id === quizId);
    const quizTitle = quiz?.title || 'Kuis Evaluasi ATPH';
    const passingScore = quiz?.passingScore || 75;

    const questions = INITIAL_QUIZ_QUESTIONS.filter((q) => q.quizId === quizId);

    // 3. Evaluasi jawaban secara aman di sisi server
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    const studentAnswersMap = new Map<string, string>();
    if (Array.isArray(answers)) {
      answers.forEach((a: any) => {
        studentAnswersMap.set(a.questionId, (a.userAnswer || '').trim());
      });
    }

    const evaluatedAnswers = questions.map((q) => {
      const userAnswer = studentAnswersMap.get(q.id) || '';
      const points = q.points || 5;
      maxScore += points;

      const isCorrect = Boolean(
        userAnswer &&
        q.correctAnswer &&
        userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      );

      if (isCorrect) {
        score += points;
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        pointsAwarded: isCorrect ? points : 0,
        explanation: q.explanation || '',
      };
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const isPassed = percentage >= passingScore;
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    const attemptResult = {
      id: attemptId,
      quizId,
      quizTitle,
      studentId,
      studentName,
      className: className || 'X ATPH',
      studentNisn: studentNisn || '-',
      score: percentage,
      maxScore: 100,
      rawScore: score,
      rawMaxScore: maxScore,
      percentage,
      passed: isPassed,
      isPassed,
      correctCount,
      wrongCount,
      totalQuestions: questions.length,
      startedAt: startedAt || new Date(Date.now() - 15 * 60000).toISOString(),
      completedAt: nowIso,
      status: 'graded' as const,
      answers: evaluatedAnswers,
    };

    // 4. Simpan ke Supabase PostgreSQL tabel quiz_attempts
    let synced = false;
    let syncError: string | null = null;

    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
      });

      // Prepare metadata payload inside answers array
      const answersPayload = [
        {
          __meta: true,
          className: className || 'X ATPH',
          studentNisn: studentNisn || '-',
          correctCount,
          wrongCount,
          percentage,
          totalQuestions: questions.length,
          completedAt: nowIso,
        },
        ...evaluatedAnswers,
      ];

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          id: attemptId,
          quiz_id: quizId,
          quiz_title: quizTitle,
          student_id: studentId,
          student_name: studentName,
          started_at: attemptResult.startedAt,
          completed_at: nowIso,
          score: percentage,
          max_score: 100,
          is_passed: isPassed,
          answers: answersPayload,
          status: 'graded',
        })
        .select('*')
        .single();

      if (error) {
        console.warn('Supabase quiz_attempts insert error:', error.message);
        syncError = error.message;
      } else if (data) {
        synced = true;
      }
    } catch (err: any) {
      console.warn('Supabase connection error:', err.message);
      syncError = err.message || 'Koneksi ke Supabase terputus';
    }

    return NextResponse.json({
      success: true,
      synced,
      syncError,
      attempt: attemptResult,
      message: synced
        ? 'Jawaban kuis dan nilai berhasil disimpan ke server Supabase'
        : 'Nilai dihitung berhasil (disimpan di perangkat, belum tersinkronisasi ke server)',
    });
  } catch (err: any) {
    console.error('Quiz submission API error:', err);
    return NextResponse.json({ error: err.message || 'Gagal memproses pengerjaan kuis' }, { status: 500 });
  }
}
