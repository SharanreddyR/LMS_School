import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookMarked, Plus } from 'lucide-react'
import { fetchLibraryBooks } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function LibraryPage() {
  const [search, setSearch] = useState('')
  const { data: books = [], isLoading } = useQuery({
    queryKey: queryKeys.library.all,
    queryFn: fetchLibraryBooks,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return books.filter(
      (b) =>
        !q ||
        [b.title, b.author, b.category, b.isbn].join(' ').toLowerCase().includes(q),
    )
  }, [books, search])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Catalog, availability, and book inventory"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? (
            <LoadingTable />
          ) : filtered.length === 0 ? (
            <EmptyState icon={BookMarked} title="No books" description="Library catalog will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell>{b.category}</TableCell>
                    <TableCell className="font-mono text-xs">{b.isbn}</TableCell>
                    <TableCell>{b.available} / {b.copies}</TableCell>
                    <TableCell>
                      <Badge variant={b.status === 'low_stock' ? 'warning' : 'success'}>
                        {b.status === 'low_stock' ? 'Low stock' : 'Available'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
