'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Download, Users } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'

// Mock data for charts
const ticketSalesData = [
  { date: '2023-01-01', sales: 120 },
  { date: '2023-02-01', sales: 250 },
  { date: '2023-03-01', sales: 300 },
  { date: '2023-04-01', sales: 450 },
  { date: '2023-05-01', sales: 500 },
  { date: '2023-06-01', sales: 600 },
]

const impressionsViewsData = [
  { name: 'Impressions', value: 100000 },
  { name: 'Views', value: 50000 },
]

// Mock data for last viewers
const lastViewers = [
  { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 4, name: 'Diana Ross', avatar: '/placeholder.svg?height=32&width=32' },
  { id: 5, name: 'Ethan Hunt', avatar: '/placeholder.svg?height=32&width=32' },
]

export default function AnalyticsPage() {
  const impressions = 100000
  const views = 50000
  const clickPerImpressionPercentage = ((views / impressions) * 100).toFixed(2)
  const totalRefund = 1500

  const handleDownload = () => {
    // Implement download functionality here
    console.log('Downloading viewers info...')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{views.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click per Impression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickPerImpressionPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impressions vs Views</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impressionsViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last Viewers</CardTitle>
            <CardDescription>Recent users who viewed the event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lastViewers.map((viewer) => (
                <div key={viewer.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={viewer.avatar} alt={viewer.name} />
                    <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{viewer.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleDownload} className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" /> Download All Viewers Info
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Refund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRefund.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

