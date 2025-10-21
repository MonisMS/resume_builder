import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable,serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { resume } from "react-dom/server";

export const users = pgTable('users',{
    id:serial("id").primaryKey(),
    name:varchar('name',{length:255}).notNull(),
    email:varchar("email",{length:255}).notNull().unique(),
    password:text('password').notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull(),


})

export const resumes = pgTable('resumes',{
    id:serial('id').primaryKey(),
    userId:integer('user_id').notNull().references(() => users.id,{onDelete:'cascade'}),
    title:varchar('title',{length:255}).notNull().default('Untitled Resume'),

    fullName: varchar('full_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  website: varchar('website', { length: 255 }),
  summary: text('summary'),
  
  experience: jsonb('experience').$type<ExperienceItem[]>().default([]),
  education: jsonb('education').$type<EducationItem[]>().default([]),
  skills: jsonb('skills').$type<string[]>().default([]),

  createdAt:timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()

})

export const usersRelations = relations(users, ({many}) =>({
resumes:many(resumes),
}))


export const resumesRelations = relations(resumes , ({one}) => ({
user : one(users, {
    fields:[resumes.userId],
    references:[users.id]
}),

}))

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;


export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}