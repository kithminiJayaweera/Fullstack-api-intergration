/* eslint-disable react-refresh/only-export-components */
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/forms/UserForm';
import { UserDetailsDialog } from '@/components/forms/UserDetailsDialog';
import { DataTableColumnHeader } from './table-columns-dropdown';
import { useUpdateMongoUser, useDeleteMongoUser } from '@/features/users/hooks/useMongoUsers';
import { MongoUser } from '@/api/user.api';

export const UserSchema = z.object({
  id: z.union([z.number().min(1), z.string().min(1)]).optional(), // Accept both number and string IDs (for MongoDB compatibility)
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  age: z
    .number()
    .min(1, 'Age must be greater than 0')
    .max(120, 'Age must be less than 120')
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine(
      (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      { message: 'Please enter a valid email address' }
    )
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        return domain && domain.includes('.');
      },
      { message: 'Email must have a valid domain' }
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(), // Optional when editing, required when creating
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true; // Allow empty
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{1,4}\)?[- ]?\d{1,4}[- ]?\d{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      },
      { message: 'Please enter a valid phone number (e.g., +1 123 456 7890 or +94 77 123 4567)' }
    ),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .optional()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
      },
      { message: 'Birth date cannot be in the future' }
    ),
  gender: z.enum(['male', 'female', 'other']).optional(),
  role: z.enum(['admin', 'user']).default('user'),
});

export type User = z.infer<typeof UserSchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  profilePicture?: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="ml-2 h-6 w-6 p-0"
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

function ActionsCell({ user }: { user: User }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const updateMutation = useUpdateMongoUser();
  const deleteMutation = useDeleteMongoUser();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        if (user._id) {
          await deleteMutation.mutateAsync(user._id);
          toast.success(`User "${user.firstName} ${user.lastName}" deleted from MongoDB!`);
        } else {
          // Fallback for local storage users (if any exist without _id)
          toast.error('Cannot delete: User has no identifier');
        }
      } catch (error) {
        console.error('❌ Delete failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to delete user: ${errorMessage}`);
      }
    }
  };

  const handleUpdate = async (updatedUser: User) => {
    try {
      if (user._id) {
        // Prepare data for MongoDB update
        const updateData: Partial<MongoUser> = {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          password: updatedUser.password, // Only update if provided
          age: updatedUser.age,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          birthDate: updatedUser.birthDate,
          role: updatedUser.role
        };
        await updateMutation.mutateAsync({ id: user._id, data: updateData });
        toast.success(`User "${updatedUser.firstName} ${updatedUser.lastName}" updated!`);
      } else {
        toast.error('Cannot update: User has no identifier');
      }
      setShowEditDialog(false);
    } catch (error) {
      console.error('❌ Update failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update user: ${errorMessage}`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowDialog(true);
          }}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowEditDialog(true);
          }}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <UserDetailsDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />

      <UserForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialData={user}
        isEdit
        onSubmit={handleUpdate}
      />
    </>
  );
}

function ViewOnlyActionsCell({ user }: { user: User }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <UserDetailsDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'profilePicture',
    header: 'Photo',
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
        {row.original.profilePicture ? (
          <img 
            src={row.original.profilePicture} 
            alt={row.original.firstName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {row.original.firstName?.[0]}{row.original.lastName?.[0]}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate max-w-[200px]">{row.getValue('email')}</span>
        <CopyButton text={row.getValue('email')} />
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue('phone')}</span>
        <CopyButton text={row.getValue('phone')} />
      </div>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as 'admin' | 'user';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          role === 'admin' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {role === 'admin' ? 'Admin' : 'User'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];

export const apiColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="truncate max-w-[200px]">{row.getValue('email')}</span>
        <CopyButton text={row.getValue('email')} />
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue('phone')}</span>
        <CopyButton text={row.getValue('phone')} />
      </div>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as 'admin' | 'user';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          role === 'admin' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {role === 'admin' ? 'Admin' : 'User'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ViewOnlyActionsCell user={row.original} />,
  },
];
