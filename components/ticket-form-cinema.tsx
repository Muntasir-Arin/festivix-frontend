'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Seat {
  id: string
  row: string
  number: number
  price: number
  isAvailable: boolean
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

interface TicketFormProps {
  selectedSeats: Seat[]
}

const TicketFormCinema: React.FC<TicketFormProps> = ({ selectedSeats }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast.success(`Tickets purchased successfully! Total: $${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Seats:</h3>
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="flex justify-between items-center">
                  <span>{seat.row}{seat.number}</span>
                  <span>${seat.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={selectedSeats.length === 0}>
              Purchase Tickets
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default TicketFormCinema

