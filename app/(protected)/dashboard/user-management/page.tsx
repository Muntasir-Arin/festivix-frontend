"use client"

import React, { useState, useMemo } from 'react'
import seedrandom from 'seedrandom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input-cn"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const seededRandom = seedrandom('fixed-seed');

// Types
interface User {
  id: string
  username: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  role: string[]
}

// Generate random data
const generateRandomUsers = (count: number): User[] => {
  const statuses: User['status'][] = ['active', 'inactive', 'suspended'];
  const roles = ['user', 'manager', 'admin', 'moderator'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[Math.floor(seededRandom() * statuses.length)],
    role: Array.from(
      { length: Math.floor(seededRandom() * 3) + 1 },
      () => roles[Math.floor(seededRandom() * roles.length)]
    )
  }));
};

const initialUsers = generateRandomUsers(100);

const UserManagementTable: React.FC = () => {
  const [users] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [suspensionType, setSuspensionType] = useState<'permanent' | 'temporary'>('permanent')
  const [suspensionDate, setSuspensionDate] = useState<Date>()
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredUsers.slice(startIndex, startIndex + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const handleAction = (action: string, user: User) => {
    if (action === 'suspend') {
      setUserToSuspend(user)
      setSuspendDialogOpen(true)
    } else {
      console.log(`Performing action: ${action} on user:`, user)
      // Here you would typically call an API to perform the action
    }
  }

  const handleSuspendSubmit = async () => {
    if (!userToSuspend) return

    const suspensionData = {
      userId: userToSuspend.id,
      type: suspensionType,
      endDate: suspensionType === 'temporary' ? suspensionDate : undefined
    }

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Suspension data submitted:', suspensionData)
      // Here you would typically call an API to perform the suspension
      setSuspendDialogOpen(false)
      setUserToSuspend(null)
      setSuspensionType('permanent')
      setSuspensionDate(undefined)
    } catch (error) {
      console.error('Error suspending account:', error)
    }
  }

  return (
    <div className="flex flex-1 h-screen">
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.role.join(', ')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleAction('make-admin', user)}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('make-manager', user)}>
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAction('activate', user)}>
                        Activate Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('suspend', user)}>
                        Suspend Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center space-x-2">
          
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Account</DialogTitle>
            <DialogDescription>
              Choose the type of suspension for this account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={suspensionType} onValueChange={(value: 'permanent' | 'temporary') => setSuspensionType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label htmlFor="permanent">Permanent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="temporary" id="temporary" />
                <Label htmlFor="temporary">Temporary</Label>
              </div>
            </RadioGroup>
            {suspensionType === 'temporary' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="suspensionDate">Suspend until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !suspensionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {suspensionDate ? format(suspensionDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={suspensionDate}
                      onSelect={setSuspensionDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSuspendSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}

export default UserManagementTable

