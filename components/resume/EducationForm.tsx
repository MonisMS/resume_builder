'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { Education } from '@/types/resume'
import { useEffect } from 'react'

const educationItemSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
})

const educationSchema = z.object({
  education: z.array(educationItemSchema),
})

type EducationFormData = z.infer<typeof educationSchema>

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: data.length > 0 ? data : [{
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  const watchedValues = watch()

  useEffect(() => {
    onChange(watchedValues.education)
  }, [watchedValues.education, onChange])

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button onClick={addEducation} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="text-sm font-medium">Education Entry</span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.school`}>School *</Label>
                    <Input
                      {...register(`education.${index}.school`)}
                      placeholder="University of California"
                    />
                    {errors.education?.[index]?.school && (
                      <p className="text-sm text-destructive">
                        {errors.education[index]?.school?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.degree`}>Degree *</Label>
                    <Input
                      {...register(`education.${index}.degree`)}
                      placeholder="Bachelor of Science"
                    />
                    {errors.education?.[index]?.degree && (
                      <p className="text-sm text-destructive">
                        {errors.education[index]?.degree?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.field`}>Field of Study</Label>
                    <Input
                      {...register(`education.${index}.field`)}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.location`}>Location</Label>
                    <Input
                      {...register(`education.${index}.location`)}
                      placeholder="Berkeley, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.startDate`}>Start Date *</Label>
                    <Input
                      type="month"
                      {...register(`education.${index}.startDate`)}
                    />
                    {errors.education?.[index]?.startDate && (
                      <p className="text-sm text-destructive">
                        {errors.education[index]?.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                    <Input
                      type="month"
                      {...register(`education.${index}.endDate`)}
                      disabled={watchedValues.education?.[index]?.current}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`education.${index}.current`}
                        {...register(`education.${index}.current`)}
                      />
                      <Label htmlFor={`education.${index}.current`}>
                        Currently studying
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No education added yet.</p>
              <p className="text-sm">Click "Add Education" to get started.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}