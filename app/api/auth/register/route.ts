import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const registerSchema = z.object({
    name: z.string().min(1,"Name is required"),
    email:z.string().email('Inavalid email'),
    password: z.string().min(6,'Password must have at least 6 characters')
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {email,name,password} = registerSchema.parse(body)


        const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email,email))
        .limit(1);

        if(existingUser){
            return NextResponse.json(
                {error:'User already exists'},
                {status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const [newUser] = await db
        .insert(users)
        .values({
            name,
            email,
            password:hashedPassword,
        }) .returning()


        return NextResponse.json(
           { message: 'User created successfully', userId: newUser.id },
      { status: 201 }
        )
    } catch (error) {
        if(error instanceof z.ZodError)
        return NextResponse.json(
            {error: 'Internal Server Error'},
            {status: 500}
        )
    }
}