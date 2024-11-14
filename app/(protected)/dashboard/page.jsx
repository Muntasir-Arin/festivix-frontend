"use client";
import React from "react";
import { useUserData } from './layout'

const Dashboard = () => {
  const userData = useUserData()
  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
      <div className="flex items-center justify-center">
      
      {userData && (
    <div className="flex items-center space-x-4 py-10 px-10 mb-6 border rounded-3xl border-neutral-200 dark:border-neutral-700 ">
      <div className="flex-shrink-0">
        <img
          className="h-36 w-36 object-cover rounded-full dark:border-2 border-primary"
          src={`${userData.profilePicture}?s=600`}
          alt={userData?.username || 'User Profile'} 
        />
      </div>
      <div className="flex flex-col">
        <p className="text-xl font-semibold text-primary">{userData.username}</p>
        <p className="text-sm text-muted-foreground">Email : {userData.email}</p>
        <p className="text-sm text-muted-foreground">Country : {userData.country}</p>
        <p className="text-sm text-muted-foreground">Joined : {new Date(userData.createdAt).toISOString().split('T')[0]}</p>
      </div>
    </div>
  )}
        </div>
        <div className="flex gap-2">
          {[...new Array(4)].map((_, idx) => (
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


export default Dashboard
