import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewResumePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
        <p className="text-muted-foreground mb-8">Start building your professional resume</p>

        <Card>
          <CardHeader>
            <CardTitle>Resume Details</CardTitle>
            <CardDescription>
              Enter the basic information for your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Software Engineer Resume" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea 
                id="summary" 
                placeholder="Brief description of your professional background..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button>Save Draft</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}