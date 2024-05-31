'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse';
import { Loader2 } from 'lucide-react';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'


function SignUpPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // * Understand please
  const debounced = useDebounceCallback(setUsername, 300)


  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      if(response?.data?.success == true){
        toast({
          title: "Success",
          description: response?.data?.message
        })
      }
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in sign-up of user", error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup Error",
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false)
    }
  }


  useEffect(() => {
    const checkUniqueUsername = async () => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
          const response = await axios.post('/api/check-username-unique',{
            requestedUsername: username
          })
          setUsernameMessage(response?.data?.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
              axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUniqueUsername()
  }, [username])


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md px-8 py-5">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Phantom Message
          </h1>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
        </div>



        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {
                    isCheckingUsername && <Loader2 className='animate-spin' />
                  }
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                </>
              ) : ('Sign Up')}
            </Button>
          </form>
        </Form>


        <div className="text-center mt-4">
          <p>
            Already a member ? {' '}
            <Link href={'/sign-in'} className='text-blue-600 hover:text-blue-800'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage