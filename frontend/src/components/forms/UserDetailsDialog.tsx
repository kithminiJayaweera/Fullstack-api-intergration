import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '../data-table/columns';

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  const getInitials = () => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">{getInitials()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
          </div>

          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-gray-900">{user.email}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium text-gray-900">{user.phone}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Age</dt>
                <dd className="font-medium text-gray-900">{user.age}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Gender</dt>
                <dd className="font-medium text-gray-900">{user.gender ?? '—'}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Birth Date</dt>
                <dd className="font-medium text-gray-900">{user.birthDate}</dd>
              </div>
            </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}