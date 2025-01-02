"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { Input } from "@/components/ui/input-cn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import dynamic from 'next/dynamic';
import { InfoIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MapInput = dynamic(() => import('@/components/map-input'), { ssr: false });
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters").max(100, "Event name must be less than 100 characters"),
  category: z.enum(['Concert', 'Conference', 'Sports', 'Workshop', 'Exhibition', 'Theater', 'Other']),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ).optional(),
  ageRestriction: z.enum(['Allow All', '13+', '18+']),
  ticketSellStart: z.string().min(1, "Please select a start date"),
  ticketSellEnd: z.string().min(1, "Please select an end date"),
  earlyBirdEnabled: z.boolean(),
  earlyBirdStart: z.string().optional(),
  earlyBirdEnd: z.string().optional(),
  earlyBirdDiscount: z.number().min(0).max(100).optional(),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  dynamicPricingEnabled: z.boolean(),
  dynamicPriceAdjustment: z.number().min(0).max(100).optional(),
  venueLayout: z.enum(['Stadium']),
  location: z.string().min(2, "Location must be at least 2 characters"),
  refundPercentage: z.number().min(50).max(100),
});
type EventFormValues = z.infer<typeof eventFormSchema>;

function EventForm() {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      category: undefined,
      description: "",
      date: "",
      time: "",
      coordinates: { lat: 0, lon: 0 },
      image: undefined,
      logo: undefined,
      ageRestriction: 'Allow All',
      ticketSellStart: "",
      ticketSellEnd: "",
      earlyBirdEnabled: false,
      earlyBirdStart: "",
      earlyBirdEnd: "",
      earlyBirdDiscount: 0,
      themeColor: "#000000",
      dynamicPricingEnabled: false,
      dynamicPriceAdjustment: 0,
      venueLayout: undefined,
      location: "",
      refundPercentage: 100,
    },
  });
  
  const router = useRouter();

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formData = new FormData();
      
      // Add fields to FormData (manually map them)
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("coordinates[lat]", data.coordinates.lat.toString());
      formData.append("coordinates[lon]", data.coordinates.lon.toString());
      formData.append("ageRestriction", data.ageRestriction);
      formData.append("ticketSellStart", data.ticketSellStart);
      formData.append("ticketSellEnd", data.ticketSellEnd);
      formData.append("earlyBirdEnabled", data.earlyBirdEnabled.toString());
      if (data.earlyBirdEnabled) {
        if (data.earlyBirdStart) formData.append("earlyBirdStart", data.earlyBirdStart);
        if (data.earlyBirdEnd) formData.append("earlyBirdEnd", data.earlyBirdEnd);
        if (data.earlyBirdDiscount) formData.append("earlyBirdDiscount", data.earlyBirdDiscount.toString());
      }
      if (data.dynamicPriceAdjustment) formData.append("dynamicPriceAdjustment", data.dynamicPriceAdjustment.toString());
      if (data.themeColor) formData.append("themeColor", data.themeColor);
  
      formData.append("dynamicPricingEnabled", data.dynamicPricingEnabled.toString());
      formData.append("venueLayout", data.venueLayout);
      formData.append("refundPercentage", data.refundPercentage.toString());
  
      if (data.image) formData.append("image", data.image);
      if (data.logo) formData.append("logo", data.logo);
      formData.append("location", data.location);
      // Log FormData for debugging
      console.log("FormData being sent:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const token = localStorage.getItem("authToken");
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Event created:", response.data);
      toast.success("Event created successfully!");
    router.push(`/events/${response.data.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Concert">Concert</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Exhibition">Exhibition</SelectItem>
                      <SelectItem value="Theater">Theater</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MapInput
                      onLocationSelect={(lat, lon) => {
                        form.setValue('coordinates', { lat, lon });
                      }}
                    />  
                  </FormControl>
                  <FormDescription>
                    Click on the map to set the event location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image for your event (max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Logo</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a logo for your event (max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageRestriction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Restriction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age restriction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Allow All">Allow All</SelectItem>
                      <SelectItem value="13+">13+</SelectItem>
                      <SelectItem value="18+">18+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dynamicPricingEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <FormLabel className="text-base">Dynamic Pricing (Experimental)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dynamic pricing adjusts ticket prices based on demand and other factors. This can help maximize revenue and manage attendance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormDescription>
                      Enable dynamic pricing for this event
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

            {form.watch('dynamicPricingEnabled') && (
              <FormField
                control={form.control}
                name="dynamicPriceAdjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dynamic Price Adjustment (%)</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum percentage for price adjustment: {field.value}%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ticketSellStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Sale Start</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticketSellEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Sale End</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="earlyBirdEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Early Bird Pricing</FormLabel>
                    <FormDescription>
                      Enable early bird pricing for this event
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

            {form.watch('earlyBirdEnabled') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="earlyBirdStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Early Bird Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="earlyBirdEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Early Bird End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <p className="text-sm text-muted-foreground"> If the Early Bird dates overlap with the ticket sale dates, priority will be given to the Early Bird dates.</p>

                <FormField
                  control={form.control}
                  name="earlyBirdDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Early Bird Discount (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="venueLayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Layout</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue layout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Stadium">Stadium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="themeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input type="color" {...field} className="w-12 h-12 p-1 rounded-md" />
                      <Input 
                        type="text" 
                        value={field.value} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="flex-grow"
                        placeholder="#000000"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Select a theme color for your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                        <FormField
              control={form.control}
              name="refundPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Percentage</FormLabel>
                  <FormControl>
                    <Slider
                      min={50}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the refund percentage: {field.value}%
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormDescription className="text-sm text-muted-foreground">

                  Festivix rules require that refunds must be available. However, please note that refunds will not be available within 48 hours of the event start time. This policy ensures a fair balance between attendee flexibility and event planning stability.

              </FormDescription>
            </FormItem>

            <div className="flex justify-between pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function EventPage() {
  return (
    <div className="container mx-auto py-10">
      <EventForm />
    </div>
  );
}

