'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/apiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const specialChar = '||';

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;
    const [isLoading, setIsLoading] = useState(false);
    const [messageData, setMessageData] = useState({
        username: params.username,
        content: ""
    })

    const handleInputs = (e: any) => {
        setMessageData({
            ...messageData,
            [e.target.name]: [e.target.value]
        })
    }
    const onSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true);

        try {
            const response = await axios.post('/api/send-messages', {
                username: messageData.username,
                content: messageData.content
            })

            toast({
                title: response.data.message,
                variant: 'default',
            });
            setMessageData({
                username: params.username,
                content: ""
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to sent message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <form onSubmit={onSubmit} className='flex flex-col gap-5'>
                <h1 className='font-semibold'>Send Anonymous Message to @{username}</h1>
                <textarea
                    placeholder="Type your Phantom message here!."
                    name='content'
                    onChange={handleInputs}
                    value={messageData.content}
                    required
                    className='w-full '
                />
                <div className="flex justify-center">
                    {isLoading ? (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isLoading || !messageData.content}>
                            Send It
                        </Button>
                    )}
                </div>
            </form>

            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
}