import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import authConfig from '@/lib/auth'
import ResumeEditor from '@/components/resume/ResumeEditor'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/Skeleton'

// Create a new empty resume
async function createNewResume() {
  const session = await getServerSession(authConfig )
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Create new resume in database
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Untitled Resume',
      userId: session.user.id,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create resume')
  }

  const resume = await response.json()
  return resume
}

export default async function NewResumePage() {
  const resume = await createNewResume()

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ResumeEditorSkeleton />}>
        <ResumeEditor resume={resume} />
      </Suspense>
    </div>
  )
}

function ResumeEditorSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b bg-background/95">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}