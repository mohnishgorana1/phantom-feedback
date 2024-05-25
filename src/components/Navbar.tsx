'use client'

import Link from "next/link"
import { Button } from "./ui/button"




function Navbar() {


  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-y-5">
        <a href="#" className="text-2xl font-bold mb-4 md:mb-0">Phantom Message</a>
        <Link href={'/sign-in'} className="self-end">
          <Button className="w-full md:w-auto">Login</Button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar