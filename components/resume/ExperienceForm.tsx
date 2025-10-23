'use client'

import { useEffect, useState } from 'react'
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
import { Plus, Trash2, Calendar } from 'lucide-react'
import { Experience } from '@/types/resume'

// Validation schema for single experience item
const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
})

const experienceSchema = z.object({
  experience: z.array(experienceItemSchema),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export default function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: data.length > 0 ? data : [{
        id: Date.now().toString(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  })

  const watchedValues = watch()

  // Update parent component when form changes
  useEffect(() => {
    onChange(watchedValues.experience)
  }, [watchedValues.experience, onChange])

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const removeExperience = (index: number) => {
    remove(index)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button onClick={addExperience} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
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
                    <span className="text-sm font-medium">Experience Entry</span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeExperience(index)}
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
                    <Label htmlFor={`experience.${index}.company`}>Company *</Label>
                    <Input
                      {...register(`experience.${index}.company`)}
                      placeholder="Acme Corp"
                    />
                    {errors.experience?.[index]?.company && (
                      <p className="text-sm text-destructive">
                        {errors.experience[index]?.company?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experience.${index}.position`}>Position *</Label>
                    <Input
                      {...register(`experience.${index}.position`)}
                      placeholder="Software Engineer"
                    />
                    {errors.experience?.[index]?.position && (
                      <p className="text-sm text-destructive">
                        {errors.experience[index]?.position?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experience.${index}.location`}>Location</Label>
                    <Input
                      {...register(`experience.${index}.location`)}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experience.${index}.startDate`}>Start Date *</Label>
                    <Input
                      type="month"
                      {...register(`experience.${index}.startDate`)}
                    />
                    {errors.experience?.[index]?.startDate && (
                      <p className="text-sm text-destructive">
                        {errors.experience[index]?.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                    <Input
                      type="month"
                      {...register(`experience.${index}.endDate`)}
                      disabled={watchedValues.experience?.[index]?.current}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`experience.${index}.current`}
                        {...register(`experience.${index}.current`)}
                      />
                      <Label htmlFor={`experience.${index}.current`}>
                        I currently work here
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience.${index}.description`}>Description</Label>
                  <Textarea
                    {...register(`experience.${index}.description`)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No experience added yet.</p>
              <p className="text-sm">Click "Add Experience" to get started.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}