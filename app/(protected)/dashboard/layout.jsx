"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconCalendarBolt ,
  IconUsersPlus,
  IconUserEdit
//   IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LayoutPage({ children }) {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page
    router.push('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch {
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]); 

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['User']
    },
    // {
    //   label: "Profile",
    //   href: "#",
    //   icon: (
    //     <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    { 
      label: "Users Control",
      href: "/dashboard/users-control",
      icon: (
        <IconUserEdit  className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['Admin', "Moderator"]
    },
    {
      label: "Manager Request",
      href: "/dashboard/manager-request",
      icon: (
        <IconUsersPlus  className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['Admin', "Moderator"]
    },
   

    {
      label: "Event Manager",
      href: "/dashboard/event-manager",
      icon: (
        <IconCalendarBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['Manager']
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['User']
    },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      permission: ['User']
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                userData?.role.some(role =>link.permission.includes(role) ) ? ( <SidebarLink key={idx} link={link} /> ) : null
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userData?.username || "Imposter",
                href: "#",
                icon: (
                  <Image
                    src={userData?.profilePicture ? `${userData.profilePicture}` : "https://i.imgur.com/p50u9jD.jpeg"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-100 dark:bg-neutral-800">
      {children}
      </main>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex items-center text-sm text-black py-1 relative z-20"
    >
          <Image 
        src="/festivix.png" // Replace with the path to your image
        alt="Icon" 
        width={24} // Set the width of the image
        height={24} // Set the height of the image
        className="block dark:hidden"
      />

      <Image 
        src="/festivix-dark.png" // Replace with the path to your image
        alt="Icon" 
        width={24} // Set the width of the image
        height={24} // Set the height of the image
        className="hidden dark:block"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium ml-2 text-black dark:text-white whitespace-pre"
      >
        FESTiViX
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex items-center text-sm text-black py-1 relative z-20"
    >
      <Image 
    src="/festivix.png" // Replace with the path to your image
    alt="Icon" 
    width={24} // Set the width of the image
    height={24} // Set the height of the image
    className="block dark:hidden"
  />

  <Image 
    src="/festivix-dark.png" // Replace with the path to your image
    alt="Icon" 
    width={24} // Set the width of the image
    height={24} // Set the height of the image
    className="hidden dark:block"
  />
    </Link>
  );
};
