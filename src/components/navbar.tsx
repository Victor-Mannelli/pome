import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { FaUserFriends, FaUserCircle } from "react-icons/fa"
import { SiNiconico } from "react-icons/si"

export default function Navbar() {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let scrollPositionNow = window.pageYOffset;
      window.onscroll = function() {
        let currentScrollPos = window.pageYOffset;
        if (scrollPositionNow < currentScrollPos || currentScrollPos === 0) {
          setShow(true)
        } else {
          setShow(false)
        }
        scrollPositionNow = currentScrollPos;
      }
    } 
  }, [])

  return (
    <div 
      className={`sticky w-full bg-second hover:opacity-100 h-16 flex justify-between items-center px-10 z-20
        ${ show ? "top-0" : "top-[-4rem]" } 
        ${router.pathname.startsWith("/pome/anime") ? "opacity-70" : "opacity-100" }`}
      style={{ transition: "top 0.3s" }}
    >
      <SiNiconico onClick={() => router.push("/pome/home")} className="text-signature text-2xl cursor-pointer hover:text-h-signature "/>
      <div>
        <h2 className="hover:text-h-signature text-signature text-xl" onClick={() => router.push("/pome/releases")}> Comming Soon! </h2>
      </div>
      <div className="flex items-center gap-7">
        <FaUserFriends onClick={() => router.push("/pome/friends")} className="text-signature text-2xl cursor-pointer hover:text-h-signature"/>
        <FaUserCircle onClick={() => router.push("/pome/profile")} className="text-signature text-2xl cursor-pointer hover:text-h-signature"/>
      </div>
    </div>
  )
}
