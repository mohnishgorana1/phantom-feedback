'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User"
import { acceptingMessagesSchema } from "@/schemas/acceptingMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { boolean } from "zod"

function Dashboard() {
  const [userId, setUserId] = useState(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(acceptingMessagesSchema)
  })
  const { watch, register, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const checkAcceptMessageStatus = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post('/api/accept-messages', { userId })
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      toast({
        title: "Can't fetch Whether a user is accepting messages or not",
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  // fetch all messages
  const fetchMessages = async () => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      console.log("userID for fetching messages: ", userId);
      const response = await axios.post('/api/get-messages', { userId })
      setMessages(response.data.messages || [])
      if (response.data.success) {
        toast({
          title: "Refreshed Messages",
          description: "Showing Latest Messages !"
        })
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Can't fetch Whether a user is accepting messages or not",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }


  // handle switch change
  const updateAcceptMessage = async () => {
    try {
      console.log("acceptMessages status before change", acceptMessages);

      const response = await axios.patch('/api/accept-messages', {
        userId: userId,
        isAcceptingMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message
      })
      console.log("acceptMessages status after change", acceptMessages);
    } catch (error) {
      toast({
        title: 'Error updating status of isAccepting Messages',
        variant: "destructive"
      })
    }
  }

  // get userId 
  useEffect(() => {
    // find user
    const user = localStorage.getItem("user") || null
    if (!user) {
      return
    }
    else {
      const currentUser = JSON.parse(user)
      console.log(currentUser.id);
      setUserId(currentUser.id)
      console.log(userId);
    }
    fetchMessages()
    checkAcceptMessageStatus()

  }, [userId])

  if (!userId) {
    return <div className="flex items-center justify-center">
      Please Login
    </div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          {/* <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button> */}
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={updateAcceptMessage}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard