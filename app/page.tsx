import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaCompass, FaHeart, FaHome, FaStore } from "react-icons/fa";
import Image from "next/image";
import { ModeToggle } from "@/components/theme-mode";
import {HomePageCards} from "@/components/homepage-card";
export default function Home() {
  return (
    (<div>
      <ModeToggle/>
      <FloatingNav
        navItems={[
          { name: "Home", link: "/", icon: <FaHome /> },
          { name: "Explore", link: "/explore", icon: <FaCompass /> },
          { name: "Sell", link: "/sell", icon: <FaStore /> },
          { name: "Favorites", link: "/favorites", icon: <FaHeart /> },
        ]}
      />
      <div className="relative xl:h-screen lg:h-[80vh] md:h-[70vh] sm:h-[65vh] h-[55vh] overflow-hidden  bg-dot-black/[0.1] ">
        {/* Background Text */}
        <h1 className=" opacity-5 absolute top-[70%] sm:top-1/2 left-[50%] transform -translate-x-1/2 sm:-translate-y-1/2 m-auto font-bold text-outline-landing -z-20">
          FESTIVIX
        </h1>

        <div className="absolute left-[2%] md:left-[15%] lg:left-[20%] top-1/2 w-[43%] lg:w-[27%] md:w-[32%] -translate-y-1/2 rounded-full bg-background aspect-square">
          <div className="absolute inset-0.5 md:inset-1 lg:inset-2 rounded-full overflow-hidden">
            <Image
              src="/eminem.jpg"
              alt="Background Image"
              quality={100}
              className="brightness-75"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover"
              }} />
          </div>
        </div>

        {/* Gray circle with outline gap */}
        <div className="absolute left-1/2 top-1/2 w-[43%] lg:w-[27%] md:w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background aspect-square">
          <div className="absolute inset-0.5 md:inset-1 lg:inset-2 rounded-full overflow-hidden">
            <Image
              src="/rosalia.jpeg"
              alt="Background Image"
              quality={10}
              className="brightness-75"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover"
              }} />
          </div>
        </div>

        {/* Dark circle with outline gap */}
        <div className="absolute right-[2%] md:right-[15%] lg:right-[20%] top-1/2 w-[43%] lg:w-[27%] md:w-[32%] -translate-y-1/2 rounded-full bg-background aspect-square">
          <div className="absolute inset-0.5 md:inset-1 lg:inset-2 rounded-full overflow-hidden">
            <Image
              src="/barca.jpg"
              alt="Background Image"
              quality={50}
              className="brightness-75"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover"
              }} />
          </div>
        </div>

        {/* Centered Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h2
            className="text-5xl md:text-6xl sm:text-7xl lg:text-8xl font-bold text-white tracking-wide opacity-95 "
            style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)" }}
          >
            FESTiviX!
          </h2>
          
        </div>
      </div>
      <div className="h-[2000px] w-full bg-dot-black/[0.1] relative flex items-center justify-center">
        <HomePageCards/>
      </div>
    </div>)
  );
}
