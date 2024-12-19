"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Dashboard = () => {
  const [userData, setUserData] = React.useState(null);
  const [isApplyingManager, setIsApplyingManager] = React.useState(false);
  const [applicationReason, setApplicationReason] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
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
  }, []); 

  const handleApplyManager = async () => {
    setIsApplyingManager(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applymanager/apply`,
        { applicationReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setIsApplyingManager(false);
      setApplicationReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setIsApplyingManager(false);
    }
  };

  if (!userData) {
    return (
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {/* Loading state */}
      </div>
    );
  }

  const getRoleColor = (role) => {
    if (role.includes("Admin")) return "from-orange-400 via-orange-600 to-orange-700";
    if (role.includes("Moderator")) return "from-yellow-400 via-yellow-600 to-yellow-700";
    if (role.includes("Manager")) return "from-green-400 via-green-600 to-green-700";
    if (role.includes("Affiliate")) return "from-purple-400 via-purple-600 to-purple-700";
    return "from-blue-400 via-blue-600 to-blue-700";
  };

  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex items-center justify-center">
          {userData && (
            <div className="flex items-center space-x-4 sm:py-10 sm:px-10 p-6 mb-6 border rounded-3xl border-neutral-200 dark:border-neutral-700 ">
              <div className="flex-shrink-0">
                <Image
                  className="sm:h-36 sm:w-36 h-24 w-24 object-cover rounded-full dark:border-2 border-primary"
                  src={`${userData.profilePicture}?s=600`}
                  alt={userData?.username || "User Profile"}
                  width={144}
                  height={144}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-primary">
                  {userData.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {userData.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Country: {userData.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(userData.createdAt).toISOString().split("T")[0]}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 mb-2">
          <div className={`h-20 w-1/3 rounded-lg flex items-center justify-center bg-gradient-to-r ${getRoleColor(userData.role)}`}>
            <div className="text-white text-center p-4">
              <p className="text-lg font-semibold mb-1">
                {userData.role.includes("Admin") ? "Admin" :
                 userData.role.includes("Moderator") ? "Moderator" :
                 userData.role.includes("Manager") ? "Manager" :
                 userData.role.includes("Affiliate") ? "Affiliate" : "User"}
              </p>
              <p className="text-sm opacity-80">
                {userData.role.includes("Admin") ? "Full access granted" :
                 userData.role.includes("Moderator") ? "Moderation privileges" :
                 userData.role.includes("Manager") ? "Event management access" :
                 userData.role.includes("Affiliate") ? "Affiliate program member" : "Standard user access"}
              </p>
            </div>
          </div>
          <div className="h-20 w-1/3 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {userData.role.includes("Manager") ? "Event Management" : "Become a Manager"}
              </h3>
              {!userData.role.includes("Manager") ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Apply for Manager Role</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for your application. We'll review your request and get back to you.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                          Reason
                        </Label>
                        <Input
                          id="reason"
                          className="col-span-3"
                          value={applicationReason}
                          onChange={(e) => setApplicationReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleApplyManager} disabled={isApplyingManager}>
                        {isApplyingManager ? "Applying..." : "Apply"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" onClick={() => router.push('/dashboard/event-manager')}>
                  Access Dashboard
                </Button>
              )}
            </div>
          </div>
          <div className="h-20 w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, idx) => (
            <div
              key={`second-array-${idx}`}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

