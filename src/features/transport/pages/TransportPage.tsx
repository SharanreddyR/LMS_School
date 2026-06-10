import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bus, Phone, Users } from 'lucide-react'
import { fetchTransportRoutes } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function TransportPage() {
  const [search, setSearch] = useState('')
  const { data: routes = [], isLoading } = useQuery({
    queryKey: queryKeys.transport.all,
    queryFn: fetchTransportRoutes,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return routes.filter(
      (r) =>
        !q ||
        [r.name, r.driver, r.vehicleNo].join(' ').toLowerCase().includes(q),
    )
  }, [routes, search])

  const totalStudents = routes.reduce((a, r) => a + r.students, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Transport" description="School bus routes, drivers, and student assignments" />

      {isLoading ? (
        <LoadingGrid count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard metric={{ id: '1', label: 'Active Routes', value: routes.filter((r) => r.status === 'active').length, trend: 'neutral' }} icon={<Bus className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Students on Bus', value: totalStudents, trend: 'neutral' }} icon={<Users className="h-5 w-5" />} />
          <StatCard metric={{ id: '3', label: 'Total Stops', value: routes.reduce((a, r) => a + r.stops, 0), trend: 'neutral' }} icon={<Phone className="h-5 w-5" />} />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? (
            <LoadingTable />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Bus} title="No routes" description="Transport routes will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.driver}</TableCell>
                    <TableCell>{r.vehicleNo}</TableCell>
                    <TableCell>{r.stops}</TableCell>
                    <TableCell>{r.students}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'active' ? 'success' : 'secondary'}>{r.status}</Badge>
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
