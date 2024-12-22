'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { Input } from "@/components/ui/input-cn"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner'
import { MoreHorizontal, Search } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface User {
  _id: string
  username: string
  email: string
  role: string[]
  status: 'Active' | 'Temporarily Suspended' | 'Permanently Suspended'
  twoFactorEnabled: boolean
  suspendUntil: string | null
  suspendHistory: {
    suspendedOn: string
    suspendedUntil: string
    reason: string
  }[]
  createdAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<'createdAt' | ''>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [roleFilter, setRoleFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspendType, setSuspendType] = useState<'temporary' | 'permanent'>('temporary')
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendUntil, setSuspendUntil] = useState('')
  useEffect(() => {
    fetchUsers()
  }, [])
  
  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken")
    try {
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users. Please try again.')
      setLoading(false)
    }
  }

  const sortedUsers = [...users]
    .filter(user => 
      (roleFilter.length === 0 || user.role.some(r => roleFilter.includes(r))) &&
      (statusFilter.length === 0 || statusFilter.includes(user.status)) &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const toggleRoleFilter = (role: string) => {
    setRoleFilter(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const handleAction = async (userId: string, action: string) => {
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/control/${userId}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        if (action === 'delete') {
          setUsers(users.filter(user => user._id !== userId))
        } else {
        setUsers(users.map(user => 
          user._id === userId 
              ? { ...user, role: response.data.roles || [] } 
              : user
      ));}
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error)
      toast.error(`Failed to perform action. Please try again.`)
    }
  }

  const handleSuspend = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/suspend/${selectedUser._id}`, {
        type: suspendType,
        reason: suspendReason,
        suspendUntil: suspendType === 'temporary' ? suspendUntil : null
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        setUsers(users.map(user => 
          user._id === selectedUser._id
            ? { ...user, ...response.data.user }
            : user
        ))
        toast.success(response.data.message)
        setSuspendDialogOpen(false)
        resetSuspendForm()
      }
    } catch (error) {
      console.error('Error suspending user:', error)
      toast.error('Failed to suspend user. Please try again.')
    }
  }

  const resetSuspendForm = () => {
    setSelectedUser(null)
    setSuspendType('temporary')
    setSuspendReason('')
    setSuspendUntil('')
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">

      <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h1 className="text-xl font-bold">User Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Role:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['User', 'Admin', 'Manager', 'Moderator'].map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={roleFilter.includes(role)}
                  onCheckedChange={() => toggleRoleFilter(role)}
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Status:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Active', 'Temporarily Suspended', 'Permanently Suspended'].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className=" rounded-md shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Two Factor</TableHead>
                <TableHead onClick={toggleSort} className="cursor-pointer">
                  Created At {sortOrder === 'asc' ? '↑' : '↓'}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.join(', ')}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'destructive'}
                          className="cursor-pointer"
                        >
                          {user.status}
                        </Badge>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>User Status Details</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          {user.status === 'Temporarily Suspended' && user.suspendUntil && (
                            <>
                              <span>Suspended until: {format(new Date(user.suspendUntil), 'PPP')}</span>
                              <br />
                            </>
                          )}
                      <span className="font-semibold mt-4 mb-2">Suspension History:</span> <br />
                          {user.suspendHistory && user.suspendHistory.length > 0 ? (
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                              {user.suspendHistory.map((history, index) => (
                                <span key={index} className="mb-4">
                                  <span>Suspended on: {format(new Date(history.suspendedOn), 'PPP')}</span> <br />
                                  <span>Suspended until: {format(new Date(history.suspendedUntil), 'PPP')}</span> <br />
                                  <span>Reason: {history.reason}</span>
                                </span>
                              ))}
                            </ScrollArea>
                          ) : (
                            <span>No suspension history.</span>
                          )}
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {user.status !== 'Active' && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'activate')}>
                            Activate
                          </DropdownMenuItem>
                        )}
                        {user.status === 'Active' && (
                          <DropdownMenuItem onSelect={() => {
                            setSelectedUser(user)
                            setSuspendDialogOpen(true)
                          }}>
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {!user.role.includes('Admin') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'make-admin')}>
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {user.role.includes('Admin') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'remove-admin')}>
                            Remove Admin
                          </DropdownMenuItem>
                        )}
                        {!user.role.includes('Moderator') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'make-moderator')}>
                            Make Moderator
                          </DropdownMenuItem>
                        )}
                        {user.role.includes('Moderator') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'remove-moderator')}>
                            Remove Moderator
                          </DropdownMenuItem>
                        )}
                        {!user.role.includes('Manager') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'make-manager')}>
                            Make Manager
                          </DropdownMenuItem>
                        )}
                        {user.role.includes('Manager') && (
                          <DropdownMenuItem onSelect={() => handleAction(user._id, 'remove-manager')}>
                            Remove Manager
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => handleAction(user._id, 'delete')} className="text-red-500">
                            Delete User
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={suspendType} onValueChange={(value: 'temporary' | 'permanent') => setSuspendType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="temporary" id="temporary" />
                <Label htmlFor="temporary">Temporary Suspension</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label htmlFor="permanent">Permanent Suspension</Label>
              </div>
            </RadioGroup>
            {suspendType === 'temporary' && (
              <div className="grid gap-2">
                <Label htmlFor="suspendUntil">Suspend Until</Label>
                <Input
                  id="suspendUntil"
                  type="date"
                  value={suspendUntil}
                  onChange={(e) => setSuspendUntil(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="suspendReason">Reason for Suspension</Label>
              <Textarea
                id="suspendReason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSuspend}>Suspend User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>

  )
} 

interface FilterIconProps extends React.SVGProps<SVGSVGElement> {}

function FilterIcon(props: FilterIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

