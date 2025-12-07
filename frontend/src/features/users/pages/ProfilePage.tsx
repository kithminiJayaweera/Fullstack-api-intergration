import { User, Mail, Phone, Calendar, Briefcase, Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/api/auth.api';
import { useUploadProfilePicture, useDeleteProfilePicture } from '@/features/auth/hooks/useProfilePicture';
import { useState, useRef } from 'react';

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadProfilePicture();
  const deleteMutation = useDeleteProfilePicture();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      uploadMutation.mutate(file, {
        onSuccess: (data) => {
          toast.success('Profile picture uploaded successfully!');
          setUser(data.user);
          setImagePreview(null);
        },
        onError: (error: any) => {
          toast.error(error.message);
          setImagePreview(null);
        }
      });
    }
  };

  const handleDeletePicture = async () => {
    if (confirm('Are you sure you want to delete your profile picture?')) {
      deleteMutation.mutate(undefined, {
        onSuccess: (data) => {
          toast.success('Profile picture deleted successfully!');
          setUser(data.user);
        },
        onError: (error: any) => {
          toast.error(error.message);
        }
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );

    if (!confirmed) return;

    try {
      // Delete the user account from database
      await api.delete('/auth/delete-account');
      
      // Logout and redirect to login page
      logout();
      toast.success('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete account';
      toast.error(errorMessage);
    }
  };

  // Use real user data from MongoDB (firstName, lastName, phone, birthDate)
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}` : 'User',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || 'user@example.com',
    phone: user?.phone || 'Not provided',
    role: user?.role === 'admin' ? 'Administrator' : 'User',
    birthDate: user?.birthDate,
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Recently',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.firstName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
              {uploadMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <span className="text-white text-xs">Uploading...</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="text-xs"
              >
                <Camera className="h-3 w-3 mr-1" />
                Upload
              </Button>
              {user?.profilePicture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePicture}
                  disabled={deleteMutation.isPending}
                  className="text-xs text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{userData.name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-lg text-gray-600">{userData.role}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role === 'admin' ? 'Full Access' : 'View Only'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Card - Data from MongoDB */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">First Name</p>
              <p className="text-sm font-medium text-gray-900">{userData.firstName || 'Not provided'}</p>
            </div>
          </div>

          {/* Last Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Last Name</p>
              <p className="text-sm font-medium text-gray-900">{userData.lastName || 'Not provided'}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900">{userData.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-gray-900">{userData.phone}</p>
            </div>
          </div>

          {/* Birth Date */}
          {userData.birthDate && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Birth Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(userData.birthDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Account Type */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              user?.role === 'admin' ? 'bg-purple-50' : 'bg-blue-50'
            }`}>
              <Briefcase className={`h-5 w-5 ${
                user?.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Account Type</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{userData.role}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role === 'admin' ? 'Full Access' : 'View Only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Member Since</p>
                <p className="text-xs text-gray-500">{userData.joinDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-xs text-gray-500">Your account is active</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 mt-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Irreversible and destructive actions
        </p>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
