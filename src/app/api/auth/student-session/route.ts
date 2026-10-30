import { NextRequest, NextResponse } from 'next/server';

// Generate deterministic unique student ID from clean email
function generateStudentId(email: string): string {
  const clean = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `usr-std-${hex}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, classId, className, fullName } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    // Validasi kata sandi wajib skaneba123
    if (cleanPassword !== 'skaneba123') {
      return NextResponse.json({ error: 'Kata sandi siswa salah! Password resmi: skaneba123' }, { status: 401 });
    }

    const studentId = generateStudentId(cleanEmail);
    const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName =
      namePart
        .split(' ')
        .filter(Boolean)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ') || 'Siswa ATPH';

    const resolvedName = (fullName && fullName.trim()) || formattedName;

    // Deterministic NISN based on email hash
    let nisnSeed = 0;
    for (let i = 0; i < cleanEmail.length; i++) {
      nisnSeed = (nisnSeed * 31 + cleanEmail.charCodeAt(i)) % 90000000;
    }
    const resolvedNisn = `00${(10000000 + Math.abs(nisnSeed)).toString()}`;

    const studentUser = {
      id: studentId,
      email: cleanEmail,
      fullName: resolvedName,
      role: 'student',
      nisn: resolvedNisn,
      classId: classId || 'cls-x-at-1',
      className: className || 'X AT 1',
      major: 'Agribisnis Tanaman Pangan dan Hortikultura',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user: studentUser,
      message: 'Login siswa berhasil dan sesi aktif',
    });

    // Store in cookie for session persistence across refreshes & tabs
    response.cookies.set('edu_student_session', JSON.stringify(studentUser), {
      path: '/',
      httpOnly: false, // Accessible to client-side auth provider
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memproses sesi siswa' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('edu_student_session');
    if (!cookie?.value) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = JSON.parse(cookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout berhasil, sesi berakhir' });
  response.cookies.delete('edu_student_session');
  return response;
}

