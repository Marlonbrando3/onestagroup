import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logotype from './images/logotype.png'
import SearchComponent from "./searchComponent"
import  MiniMainViewBlog from './MiniMainViewBlog'

export default function HeaderBlog() {
  return (
    <>
    <div className='bg-white w-full h-24 flex justify-between lg:px-36 px-1 items-center'>
        <Link className="cursor-pointer flex items-center" href='/'>
        <Image className="py-3"
            src={Logotype}
            width={150}
            alt="logo"
          />
      </Link>
        <SearchComponent />
    </div>
        <MiniMainViewBlog />
    </>
  )
}
