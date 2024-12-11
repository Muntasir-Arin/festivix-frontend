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

const formSchema = z.object({
  zone: z.string().min(1, 'Please select a zone'),
  quantity: z.number().min(1).max(10),
  price: z.number().min(0),
})

interface TicketFormProps {
  selectedZone: {
    id: string
    name: string
    price: number
    ticketsRemaining: number
  } | null
}

const TicketFormStadium: React.FC<TicketFormProps> = ({ selectedZone }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zone: '',
      quantity: 1,
      price: 0,
    },
  })

  React.useEffect(() => {
    if (selectedZone) {
      form.setValue('zone', selectedZone.name)
      form.setValue('price', selectedZone.price)
    }
  }, [selectedZone, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success(`Tickets purchased successfully! Total: $${values.quantity * values.price}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    {selectedZone ? `Tickets remaining: ${selectedZone.ticketsRemaining}` : 'Click on the stadium map to select a zone'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      min={1}
                      max={selectedZone ? selectedZone.ticketsRemaining : 10}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the number of tickets (max {selectedZone ? selectedZone.ticketsRemaining : 10})
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Price per ticket:</span>
                <span>${selectedZone?.price || 0}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total:</span>
                <span>${(selectedZone?.price || 0) * form.watch('quantity')}</span>
              </div>
              <Button type="submit" className="w-full" disabled={!selectedZone}>
                Purchase Tickets
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default TicketFormStadium

