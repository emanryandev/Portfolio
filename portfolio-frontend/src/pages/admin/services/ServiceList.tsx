import { useNavigate } from 'react-router-dom';
import { useAdminServices, useDeleteService, AdminService } from '@/features/services/api/admin';
import { AdminDataTable } from '@/components/layout/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/shared/SEO';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function ServiceList() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, refetch } = useAdminServices();
  const deleteMutation = useDeleteService();
  
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete service "${name}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete service.');
      }
    }
  };

  const columns: ColumnDef<AdminService, any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
    },
    {
      accessorKey: 'price_type',
      header: 'Pricing',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="capitalize">{row.original.price_type.replace('_', ' ')}</span>
          {row.original.price && <span className="text-xs text-muted-foreground">{row.original.price}</span>}
        </div>
      )
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      cell: ({ row }) => (
        row.original.is_featured ? <Badge>Featured</Badge> : null
      )
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
          {row.original.is_active ? 'Active' : 'Draft'}
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
              onClick={() => navigate(`/admin/services/${row.original.id}/edit`)}
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
      <SEO title="Manage Services" description="Manage service packages" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your service packages and offerings.</p>
        </div>
        <Button onClick={() => navigate('/admin/services/new')}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
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
