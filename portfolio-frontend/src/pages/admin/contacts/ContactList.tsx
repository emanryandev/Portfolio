import { useNavigate } from 'react-router-dom';
import { useAdminContactRequests, useDeleteContactRequest, useUpdateContactStatus, AdminContactRequest } from '@/features/contact/api/admin';
import { AdminDataTable } from '@/components/layout/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/shared/SEO';
import { Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  in_progress: 'secondary',
  completed: 'outline',
  archived: 'destructive',
};

export default function ContactList() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, refetch } = useAdminContactRequests();
  const deleteMutation = useDeleteContactRequest();
  const updateStatusMutation = useUpdateContactStatus();
  
  const handleDelete = async (id: number, email: string) => {
    if (window.confirm(`Delete contact request from ${email}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete request.');
      }
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const columns: ColumnDef<AdminContactRequest, any>[] = [
    {
      accessorKey: 'client_name',
      header: 'Client',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.client_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.client_email}</div>
        </div>
      )
    },
    {
      accessorKey: 'project_type',
      header: 'Project Type',
      cell: ({ row }) => <span className="capitalize">{row.original.project_type?.replace('_', ' ') ?? '-'}</span>
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-full justify-start px-2 font-normal">
                <Badge variant={statusColors[status || 'new'] || 'default'} className="capitalize">
                  {(status || 'new').replace('_', ' ')}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'new')}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'in_progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'archived')}>
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/admin/contacts/${row.original.id}`)}
            >
              <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(row.original.id, row.original.client_email)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <SEO title="Contact Requests" description="Manage incoming contact requests" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Requests</h1>
          <p className="text-muted-foreground">View and manage client inquiries.</p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={response?.data || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
}
