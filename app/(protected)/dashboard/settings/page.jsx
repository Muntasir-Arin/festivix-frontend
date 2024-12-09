"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
// Define schema for form validation
const FormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string(),
  twoFactorEnabled: z.boolean(),
})

const Settings = () => {
  // Initialize the form with react-hook-form
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      country: "",
      twoFactorEnabled: true,
    },
  })

  // Fetch default values for the form (you can replace the URL with your API endpoint)
  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.data) {
          form.reset({
            username: response.data.username,
            email: response.data.email,
            country: response.data.country,
            twoFactorEnabled: response.data.twoFactorEnabled,
          })
        } else {
          console.error("Error fetching profile data:", response.data.message)
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Submit handler for the form
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/updateprofile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data) {
        console.log(response.data.message)

      } else {
        console.error("Error updating profile:", response.data.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div>
                <h3 className="mb-4 text-lg font-medium">Account Settings</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="twoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Two-Factor Authentication
                          </FormLabel>
                          <FormDescription className='mr-3'>
                            Enhance your account security by enabling two-factor
                            authentication.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Settings