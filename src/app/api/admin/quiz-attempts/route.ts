import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngreirksuoraurufzftn.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Tj16Oq3f9BqbVj35Le-7bQ_avuh1PjD';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('quizId');
    const studentId = searchParams.get('studentId');

    let query = supabase
      .from('quiz_attempts')
      .select('*')
      .order('completed_at', { ascending: false });

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }
    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 });
    }

    // Format attempts and extract metadata
    const attempts = (data || []).map((row: any) => {
      let answersList: any[] = [];
      let meta: any = {};

      if (Array.isArray(row.answers)) {
        const first = row.answers[0];
        if (first && first.__meta) {
          meta = first;
          answersList = row.answers.slice(1);
        } else {
          answersList = row.answers;
        }
      }

      const correctCount = meta.correctCount ?? answersList.filter((a: any) => a.isCorrect).length;
      const wrongCount = meta.wrongCount ?? (answersList.length - correctCount);
      const className = meta.className || 'X ATPH';
      const studentNisn = meta.studentNisn || '-';
      const subjectName = meta.subjectName || 'Dasar-Dasar Agribisnis Tanaman';
      const topic = meta.topic || 'Pengelolaan Faktor Produksi';

      return {
        id: row.id,
        quizId: row.quiz_id,
        quizTitle: row.quiz_title || 'Kuis ATPH',
        studentId: row.student_id,
        studentName: row.student_name,
        className,
        studentNisn,
        subjectName,
        topic,
        score: Number(row.score) || 0,
        maxScore: Number(row.max_score) || 100,
        percentage: Number(row.score) || 0,
        isPassed: Boolean(row.is_passed),
        passed: Boolean(row.is_passed),
        correctCount,
        wrongCount,
        totalQuestions: meta.totalQuestions || answersList.length || 20,
        startedAt: row.started_at,
        completedAt: row.completed_at || row.started_at,
        status: row.status || 'graded',
        answers: answersList,
        source: 'supabase',
      };
    });

    return NextResponse.json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}

