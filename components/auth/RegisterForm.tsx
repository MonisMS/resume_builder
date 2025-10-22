"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const RegisterForm = () =>{
const [loading,setLoading] = useState(false)
const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
})
const router = useRouter()

const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    setFormData(prev =>({
        ...prev,
        [e.target.name] : e.target.value,
    }))
}

    const handleSubmit= async(e:React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);


        if(formData.password !== formData.confirmPassword){
            toast.error("Passwords do not match")
            setLoading(false)
            return
        }

        
    if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setLoading(false)
        return
      }

       try {
         const response = await fetch('/api/auth/register',{
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               name: formData.name,
               email: formData.email,
               password: formData.password,
             }),
           })

          const data = await response.json()

          if(!response.ok){
            toast.error(data.error || 'Registration Failed')
            return 
          }
          toast.success('Registration successful! Please sign in.')
      router.push('/login')
      } catch (error) {
        toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
    return (
        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle>
                    Create Account
                </CardTitle>
                <CardDescription>
                    Start Building Your Professional Resume
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}