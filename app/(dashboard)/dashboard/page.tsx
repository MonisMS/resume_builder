import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Download, Edit, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import authConfig from '@/lib/auth'

// Fetch user's resumes
async function getUserResumes() {
  const session = await getServerSession(authConfig)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/resumes`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch resumes')
  }

  return response.json()
}

export default async function DashboardPage() {
  const resumes = await getUserResumes()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">Manage and create your professional resumes</p>
        </div>
        <Link href="/resume/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Resume
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resumes.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first professional resume to get started
                </p>
                <Link href="/resume/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          resumes.map((resume: any) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      {resume.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Last updated {formatDate(resume.updatedAt)}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {resume.status || 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}