import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { resumes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/resumes/:id - Get specific resume
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumeId = parseInt(params.id);

    const [resume] = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(session.user.id))
        )
      )
      .limit(1);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/resumes/:id - Update resume
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumeId = parseInt(params.id);
    const body = await request.json();
    const { title, personalInfo, experience, education, skills } = body;

    const [updatedResume] = await db
      .update(resumes)
      .set({
        title,
        fullName: personalInfo?.fullName,
        email: personalInfo?.email,
        phone: personalInfo?.phone,
        location: personalInfo?.location,
        website: personalInfo?.website,
        summary: personalInfo?.summary,
        experience,
        education,
        skills,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!updatedResume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResume);
  } catch (error) {
    console.error('Update resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/resumes/:id - Delete resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumeId = parseInt(params.id);

    const [deletedResume] = await db
      .delete(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!deletedResume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}