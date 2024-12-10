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

const MapInput = dynamic(() => import('@/components/map-input'), { ssr: false });

const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters").max(100, "Event name must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  latitude: z.string().regex(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/, "Invalid latitude"),
  longitude: z.string().regex(/^-?((1[0-7][0-9])|([1-9]?[0-9]))\.{1}\d{1,6}$/, "Invalid longitude"),
  image: z.instanceof(File).optional(),
  ageRestriction: z.string(),
  dynamicPricing: z.boolean(),
  maxPricingPercent: z.number().min(0).max(100).optional(),
  ticketSaleStart: z.string().min(1, "Please select a start date"),
  ticketSaleEnd: z.string().min(1, "Please select an end date"),
  venueType: z.string().min(1, "Please select a venue type"),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  imageurl: z.string().optional(),
  location:z.any()

});
type EventFormValues = z.infer<typeof eventFormSchema>;

const uploadImageAndGetUrl = async (file: File): Promise<string> => {
  // Implement your image upload logic here
  // For now, we'll return a placeholder URL
  return "https://example.com/placeholder-image.jpg";
};
function EventForm() {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      date: "",
      time: "",
      latitude: "",
      longitude: "",
      ageRestriction: "",
      dynamicPricing: false,
      maxPricingPercent: 5,
      ticketSaleStart: "",
      ticketSaleEnd: "",
      venueType: "",
      themeColor: "#000000",
      location:'',
      imageurl:''
    },
  });
  const router = useRouter();

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formData = new FormData();
      
      for (const [key, value] of Object.entries(data)) {
        if (value instanceof File) {
          try {
            const imageUrl = await uploadImageAndGetUrl(value);
            formData.append('imageurl', imageUrl);
          } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Failed to upload image. Please try again.");
            return;
          }
        } else if (key === 'location') {
          if (value) {
            formData.append('latitude', value.lat.toString());
            formData.append('longitude', value.lng.toString());
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }

      // Log FormData content
      console.log('FormData content:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Uncomment the following lines when ready to submit to the server
      // const response = await axios.post('http://localhost:3000/api/events', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // toast.success("Event created successfully!");
      // router.push('/events');

    } catch (error) {
      console.error('Error creating event:', error);
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
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
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
              name="venueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="stadium">Stadium</SelectItem>
                      <SelectItem value="arena">Arena</SelectItem>
                      <SelectItem value="theater">Theater</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <MapInput
                      onLocationSelect={(lat, lng) => {
                        form.setValue('latitude', lat.toString());
                        form.setValue('longitude', lng.toString());
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
                  <FormLabel>Event Image/Poster</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                  </FormControl>
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
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="18+">18+</SelectItem>
                      <SelectItem value="21+">21+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dynamicPricing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dynamic Pricing</FormLabel>
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

            {form.watch('dynamicPricing') && (
              <FormField
                control={form.control}
                name="maxPricingPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Addition/Subtraction Percent</FormLabel>
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
                name="ticketSaleStart"
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
                name="ticketSaleEnd"
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

