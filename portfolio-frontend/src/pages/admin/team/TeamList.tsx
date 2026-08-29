import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTeamMembers, useDeleteTeamMember, AdminTeamMember } from '@/features/team/api/admin';
import { AdminDataTable } from '@/components/layout/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/shared/SEO';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function TeamList() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, refetch } = useAdminTeamMembers();
  const deleteMutation = useDeleteTeamMember();
  
  // We will build a reusable ConfirmDialog later, for now we use a simple window.confirm to block
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete team member "${name}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete team member.');
      }
    }
  };

  const columns: ColumnDef<AdminTeamMember, any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
            {row.original.image_url ? (
              <img src={row.original.image_url} alt={row.original.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary">
                {row.original.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      accessorKey: 'order',
      header: 'Order',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/admin/team/${row.original.id}/edit`)}
            >
              <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(row.original.id, row.original.name)}
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
      <SEO title="Manage Team" description="Manage team members" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team profiles and roles.</p>
        </div>
        <Button onClick={() => navigate('/admin/team/new')}>
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
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
