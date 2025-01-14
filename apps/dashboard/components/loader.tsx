import Image from "next/image";

import spinner from '../public/assets/icons/spinner.gif'
import loader from '../public/assets/icons/loader.gif'

export default function Loader() {
  return (
    <div className="rounded-xl relative">
      <Image
        src={loader}
        alt="banner"
        className="object-cover rounded-md"
        height={100}
        width={500}
        objectFit='cover'
      />
    </div>
  )
}
