'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
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

import { Loader2 } from 'lucide-react';
import { signInSchema } from '@/schemas/signInSchema';
import axios from 'axios';
import { setCookie } from 'cookies-next';


function SignInPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const handleInputs = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: [e.target.value]
    })
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    console.log("LOG IN REQUEST");
    if (!formData.identifier || !formData.password) {
      toast({
        title: "OOPs",
        description: `Please fill all details`,
        variant: "destructive"
      })
      return
    }
    console.log(formData);
    

    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-in', {
        identifier: formData.identifier[0],
        password: formData.password[0]
      })
      if (response?.data?.success == true) {
        // cookies
        setCookie('token', response.data.token, { maxAge: 60 * 60 * 24 })
        setCookie('user', JSON.stringify(response.data.user), { maxAge: 60 * 60 * 24 })
        // local storage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        console.log("Login Success see cookies");

        toast({
          title: "Success",
          description: response?.data?.message
        })
      }

      router.replace('/dashboard');
    } catch (error: any) {
      console.error("Error in sign-in user", error);
      toast({
        title: "Failed",
        description: `Failed To Login ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)

    }

  }


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className="w-full max-w-md space-y-8 px-12 py-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Phantom Message
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>

        {/* form */}
        <form onSubmit={onSubmit} className='flex flex-col items-start justify-start gap-y-10'>
          <div className="flex flex-col w-full">
            <label
              htmlFor="username/email"
              className="place-self-start text-sm sm:text-lg font-semibold tracking-wider "
            >
              Username/Email
            </label>
            <input
              type="text"
              name="identifier"
              onChange={handleInputs}
              value={formData.identifier}
              className="pl-2 py-1 border border-gray-400 rounded-md text-gray-900 w-full"
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="password"
              className="place-self-start text-sm sm:text-lg font-semibold tracking-wider "
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleInputs}
              value={formData.password}
              className="pl-2 py-1 border border-gray-400 rounded-md text-gray-900 w-full"
              required
            />
          </div>{" "}
          <button
            type="submit"
            className="self-center border px-4 py-2 bg-[#0f1729] text-white rounded-lg hover:scale-105 ease-in-out duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
              </>
            ) : ('Sign In')}
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Does not hav an account ? {' '}
            <Link href={'/sign-up'} className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage