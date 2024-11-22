import Image from 'next/image'
import React from 'react'
import banner from '../public/banner.png'

export default function Banner() {
  return (
    <div className="h-28 rounded-xl relative bg-muted/50 w-full">
      <Image
        src={banner}
        alt="banner"
        className="object-cover rounded-md"
        fill
        objectFit='cover'
      />
    </div>
  )
}
    
