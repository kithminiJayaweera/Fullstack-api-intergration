/* eslint-disable @typescript-eslint/no-explicit-any */
// keep imports minimal — UI components are provided by CustomForm
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CustomForm from '@/components/shared/form';


export interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Record<string, any>>;
  onSubmit: (data: any) => Promise<void> | void;
  isEdit?: boolean;
}

export function UserForm({ open, onOpenChange, initialData, onSubmit, isEdit }: UserFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the user details below and click Update.'
              : 'Fill out the form to add a new user.'}
          </DialogDescription>
        </DialogHeader>
        <CustomForm
          initialData={initialData as any}
          isEdit={isEdit}
          onSubmit={onSubmit}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
