"use client"

import { Users as UsersIcon, Shield, Edit, Trash2, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

interface UserTableProps {
  users: User[]
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
  onToggleActive: (userId: string, isActive: boolean) => void
  currentUserId: string
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleActive,
  currentUserId,
}: UserTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
          <Shield className="w-3 h-3 mr-1" />
          Super Admin
        </Badge>
      )
    }
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
        <UsersIcon className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Power className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
        <PowerOff className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <UsersIcon className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-lg font-semibold">No users found</p>
        <p className="text-sm">Try adjusting your filters or create a new admin user</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead className="w-[150px]">Role</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[180px]">Last Login</TableHead>
            <TableHead className="w-[180px]">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId
            
            return (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-emerald-600 font-semibold">
                          (You)
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(user.last_login_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(user.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user.id)}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {/* Toggle Active/Inactive */}
                    {!isSelf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleActive(user.id, !user.is_active)}
                        className={
                          user.is_active
                            ? "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                            : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                        }
                        title={user.is_active ? "Deactivate user" : "Activate user"}
                      >
                        {user.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                    {/* Delete Button */}
                    {!isSelf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
