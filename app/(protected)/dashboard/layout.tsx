"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserDataContext from "./UserDataContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
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
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
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
                    src={userData?.profilePicture || "https://i.imgur.com/p50u9jD.jpeg"}
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

      <main className="flex-1 bg-gray-100 dark:bg-neutral-800">
        <UserDataContext.Provider value={userData}>
          {children}
        </UserDataContext.Provider>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="font-normal flex items-center text-sm text-black py-1 relative z-20">
      <Image 
        src="/festivix.png"
        alt="Icon" 
        width={24}
        height={24}
        className="block dark:hidden"
      />
      <Image 
        src="/festivix-dark.png"
        alt="Icon" 
        width={24}
        height={24}
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
}

function LogoIcon() {
  return (
    <Link href="/" className="font-normal flex items-center text-sm text-black py-1 relative z-20">
      <Image 
        src="/festivix.png"
        alt="Icon" 
        width={24}
        height={24}
        className="block dark:hidden"
      />
      <Image 
        src="/festivix-dark.png"
        alt="Icon" 
        width={24}
        height={24}
        className="hidden dark:block"
      />
    </Link>
  );
}

