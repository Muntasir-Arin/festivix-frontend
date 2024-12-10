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
import MapInput from "@/components/map-input";


const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters").max(100, "Event name must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  latitude: z.string(),
  longitude: z.string(),
  image: z.instanceof(File).optional(),
  imageurl: z.string().optional(),
  ageRestriction: z.string(),
  dynamicPricing: z.boolean(),
  maxPricingPercent: z.number().min(0).max(100).optional(),
  ticketSaleStart: z.string().min(1, "Please select a start date"),
  ticketSaleEnd: z.string().min(1, "Please select an end date"),
  venueType: z.string().min(1, "Please select a venue type"),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  location:z.any()
});

const uploadImageAndGetUrl = async (file: File) => {
  try {
    // Prepare the data for the image upload API
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    imageFormData.append('type', 'image'); 
    imageFormData.append('title', 'Simple upload');
    imageFormData.append('description', 'This is a simple image upload in Imgur'); 


    // Call the API (example: Imgur API)
    const response = await axios.post('https://api.imgur.com/3/image', imageFormData, {
      headers: {
        Authorization: 'Client-ID 200b6acfd8c1b04',
        'Content-Type': 'multipart/form-data',

      },
    });

    // Extract and return the image URL from the API response
    return response.data.data.link; // Adjust this based on the API response structure
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
};



export default function EventForm() {
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

  const onSubmit = async (data: z.infer<typeof eventFormSchema>) => {
    try {
      const formData = new FormData();

      const processFormData = async (data: { name: string; category: string; description: string; date: string; time: string; latitude: string; longitude: string; ageRestriction: string; dynamicPricing: boolean; ticketSaleStart: string; ticketSaleEnd: string; venueType: string; themeColor: string; image?: File | undefined; imageurl?: string | undefined; maxPricingPercent?: number | undefined; location?: any; } | { [s: string]: unknown; } | ArrayLike<unknown>) => {
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof File) {
            try {
              // Call the upload API and get the image URL
              const imageUrl = await uploadImageAndGetUrl(value);
      
              // Append the image URL to the formData
              formData.append('imageurl', imageUrl);
            } catch (error) {
              console.error('Skipping image URL append due to upload error:', error);
            }
          } else if (key === 'location' || key === 'imageurl') {
            // Skip 'location' and 'imageurl' fields if no special handling is needed
            continue;
          } else {
            // For other keys, convert the value to a string and append it
            formData.append(key, String(value));
          }
        }
      
        // Log formData content nicely
        console.log('FormData content:');
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      };

      processFormData(data);

      
      

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
    <div className="container mx-auto py-10">
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
    </div>
  );
}

