'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { deleteCookie, setCookie } from "cookies-next"
import { useToast } from "./ui/use-toast"


function Navbar() {
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const logout = async () => {
    console.log("Logging Out");

    // cookie
    deleteCookie('token')
    deleteCookie('user')

    // local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    console.log("Logout Success");
    setIsLoggedIn(false)

    toast({
      title: "Success",
      description: "User Logged Out Successfully"
    })
  }

  useEffect(() => {
    const user = localStorage.getItem("user") || null
    if (user) {
      setIsLoggedIn(true)
      setUser(JSON.parse(user))
      
    }
  }, [isLoggedIn])


  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="w-full flex justify-between items-center gap-y-5 px-5">
        <a href="#" className="text-xl sm:text-2xl font-bold">Phantom Message</a>
        {
          isLoggedIn ? (
            <>
              {/* <h1>{user?.username}</h1> */}
              <div className="self-end" onClick={logout}>
                <Button className="w-full md:w-auto">Logout</Button>
              </div>
            </>
          ) : (<Link href={'/sign-in'} className="self-end">
            <Button className="w-full md:w-auto">Login</Button>
          </Link>)
        }

      </div>
    </nav>
  )
}

export default Navbar