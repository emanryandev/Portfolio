import { useNavigate } from 'react-router-dom';
import { useAdminProjects, useDeleteProject, AdminProject } from '@/features/projects/api/admin';
import { AdminDataTable } from '@/components/layout/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/shared/SEO';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function ProjectList() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, refetch } = useAdminProjects();
  const deleteMutation = useDeleteProject();
  
  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Delete project "${title}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete project.');
      }
    }
  };

  const columns: ColumnDef<AdminProject, any>[] = [
    {
      accessorKey: 'title',
      header: 'Project',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden shrink-0">
            {row.original.image_url ? (
              <img src={row.original.image_url} alt={row.original.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-primary/10">
                No Img
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-xs text-muted-foreground">{row.original.slug}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'client_name',
      header: 'Client',
      cell: ({ row }) => row.original.client_name || <span className="text-muted-foreground italic">None</span>
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      cell: ({ row }) => (
        row.original.is_featured ? <Badge>Featured</Badge> : null
      )
    },
    {
      accessorKey: 'published_at',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.published_at ? 'default' : 'secondary'}>
          {row.original.published_at ? 'Published' : 'Draft'}
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
              onClick={() => navigate(`/admin/projects/${row.original.id}/edit`)}
            >
              <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(row.original.id, row.original.title)}
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
      <SEO title="Manage Projects" description="Manage portfolio projects" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects and case studies.</p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="w-4 h-4 mr-2" /> New Project
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
