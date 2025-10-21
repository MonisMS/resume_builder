import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, parseInt(session.user.id)));

    return NextResponse.json(userResumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function POST(request:NextRequest){
    try {
        const session = await auth();
          if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json()
    const { title,personalInfo,experience,education,skills } = body;

    const [newResume] = await db
    .insert(resumes)
    .values({
      userId: parseInt(session.user.id),
        title: title || 'Untitled Resume',
        fullName: personalInfo?.fullName || '',
        email: personalInfo?.email || '',
        phone: personalInfo?.phone || '',
        location: personalInfo?.location || '',
        website: personalInfo?.website || '',
        summary: personalInfo?.summary || '',
        experience: experience || [],
        education: education || [],
        skills: skills || [],  
    }) .returning()
    return NextResponse.json(newResume,{status:201})
    } catch (error) {
        console.error('Create resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    }
}