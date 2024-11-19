"use client";
import React from "react";
import { useUserData } from "./layout";
import Image from "next/image";

const Dashboard = () => {
  const userData = useUserData();
  if (!userData) {
    return (
      <div className=" p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">

      </div>
    );
  }
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
                  width={144} // Width and height are set to 144px (36 * 4) to match h-36 w-36
                  height={144}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-primary">
                  {userData.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email : {userData.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Country : {userData.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined :{" "}
                  {new Date(userData.createdAt).toISOString().split("T")[0]}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <div
            className={`h-20 w-full rounded-lg flex items-center justify-center
    ${userData.role.includes("Admin")
                ? "bg-gradient-to-r from-orange-400 via-orange-600 to-orange-700"
                : userData.role.includes("Moderator")
                  ? "bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-700"
                  : userData.role.includes("Manager")
                    ? "bg-gradient-to-r from-green-400 via-green-600 to-green-700"
                    : userData.role.includes("Affiliate")
                      ? "bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700"
                      : "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700"
              }`}
          >
            {userData.role.includes("Admin") ? (
              <p className="text-white text-sm sm:text-base md:text-lg text-center">
                You&apos;re an admin
              </p>
            ) : userData.role.includes("Manager") ? (

              <p className="text-white text-sm sm:text-base md:text-lg text-center">
                You&apos;re a manager
              </p>
            ) : userData.role.includes("Moderator") ? (
              <p className="text-white text-sm sm:text-base md:text-lg text-center">
                You&apos;re a moderator
              </p>
            ) : userData.role.includes("Affiliate") ? (
              <p className="text-white text-sm sm:text-base md:text-lg text-center">
                You&apos;re an affiliate
              </p>
            ) : (
              <p className="text-white text-sm sm:text-base md:text-lg text-center text-balance p-2">
                Apply for Manager/Affiliate
              </p>
            )}
          </div>

          {[...new Array(2)].map((_, idx) => (
            <div
              key={"first-array-" + idx} // Using idx to ensure unique key
              className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, idx) => (
            <div
              key={"second-array-" + idx} // Using idx here as well
              className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
