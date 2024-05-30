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
  const [isDashboardPage, setIsDashboardPage] = useState(false)

  // const URLpathname = window.location.pathname
  // console.log(URLpathname);



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

  // useEffect(() => {
  //   if (URLpathname === "/dashboard") {
  //     setIsDashboardPage(true)
  //   }
  // }, [URLpathname])


  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="w-full grid grid-cols-12 items-center">
        <a href="" className="col-span-6 sm:col-span-5 text-xl sm:text-2xl font-bold items-center">Phantom Message</a>
        {
          isLoggedIn ? (
            <div className="col-span-6 sm:col-span-7 grid grid-cols-12 items-center">
              <div className="col-span-8 sm:col-span-10 flex gap-2 sm:gap-5 items-center sm:ml-8">
                <Link href={'/'}>
                  <div className="w-full md:w-auto cursor-pointer underline hover:font-bold">Home</div>
                </Link>

                <Link href={'/dashboard'}>
                  <div className="w-full md:w-auto cursor-pointer underline hover:font-bold">Dashboard</div>
                </Link>
              </div>

              <div className="col-span-4 sm:col-span-2" onClick={logout}>
                <Button className="w-full md:w-auto" size={"sm"}>Logout</Button>
              </div>
            </div>
          ) : (<Link href={'/sign-in'} className="self-end">
            <Button className="w-full md:w-auto">Login</Button>
          </Link>)
        }

      </div>
    </nav>
  )
}

export default Navbar