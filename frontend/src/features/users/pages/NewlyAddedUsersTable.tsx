import { columns, User } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { useMongoUsers, useCreateMongoUser } from '@/features/users/hooks/useMongoUsers';
import { MongoUser } from '@/api/user.api';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function NewlyAddedUsersTable() {
  const { data: paginatedData, isLoading, error } = useMongoUsers(1, 100); // Get first 100 users
  const createMutation = useCreateMongoUser();
  const { user } = useAuth();
  
  const mongoUsers = paginatedData?.users || [];
  const isAdmin = user?.role === 'admin';

  const userSearchFields = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  const handleAdd = async (userData: User) => {
    try {
      const mongoUserData: Omit<MongoUser, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // Required for new users
        age: userData.age,
        phone: userData.phone,
        gender: userData.gender || 'other',
        birthDate: userData.birthDate,
        role: userData.role || 'user'
      };
      await createMutation.mutateAsync(mongoUserData);
      toast.success(`User "${userData.firstName} ${userData.lastName}" Succesfully Added!`);
    } catch (error) {
      console.error('❌ Failed to create user in MongoDB:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to add user: ${errorMessage}`);
    }
  };

  const handleDeleteSelected = (rows: User[]) => {
    toast.error('Bulk delete is not yet supported for MongoDB users');
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} showImage={false} />;
  }

  if (error) {
    console.error('❌ MongoDB connection error:', error);
    return (
      <div className="mb-8">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-bold">
            ❌ Backend Connection Error
          </p>
          <p className="text-xs text-red-600 mt-1">
            {error.message}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Please start the backend server to connect to MongoDB.
          </p>
        </div>
      </div>
    );
  }

  // Convert MongoUser to User format
  const convertedMongoUsers: User[] = mongoUsers.map(user => ({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    role: user.role,
    profilePicture: user.profilePicture,
    _id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));

  return (
    <div className="mb-8">
      {/* Status banner removed: connection status is implicit in functionality */}

      <DataTable
        columns={columns}
        data={convertedMongoUsers}
        onAddData={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        searchFields={userSearchFields}
        defaultSearchField="firstName"
        isAdmin={isAdmin}
      />
    </div>
  );
}
