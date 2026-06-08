import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Wallet, Plus, DollarSign } from 'lucide-react'
import { fetchFeeStructures, fetchFeePayments } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function FeesPage() {
  const [search, setSearch] = useState('')
  const { data: structures = [], isLoading: loadingStruct } = useQuery({ queryKey: queryKeys.fees.structure, queryFn: fetchFeeStructures })
  const { data: payments = [], isLoading: loadingPay } = useQuery({ queryKey: queryKeys.fees.payments, queryFn: fetchFeePayments })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return payments.filter((p) => !q || [p.studentName, p.grade].join(' ').toLowerCase().includes(q))
  }, [payments, search])

  const collected = payments.filter((p) => p.status === 'paid').length
  const overdue = payments.filter((p) => p.status === 'overdue').length

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Management" description="Fee structures, payments, and outstanding balances" actions={
        <Button className="gap-1.5"><Plus className="h-4 w-4" />Record Payment</Button>
      } />

      {!loadingPay && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard metric={{ id: '1', label: 'Collection Rate', value: '87%', trend: 'up', change: 3, changeLabel: 'this month' }} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Paid', value: collected, trend: 'neutral' }} icon={<Wallet className="h-5 w-5" />} />
          <StatCard metric={{ id: '3', label: 'Overdue', value: overdue, trend: 'down' }} />
        </div>
      )}

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardContent className="space-y-4 p-6">
              <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
              {loadingPay ? <LoadingTable /> : filtered.length === 0 ? (
                <EmptyState icon={Wallet} title="No payments" description="Fee payment records will appear here." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Grade</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.studentName}</TableCell>
                        <TableCell className="hidden sm:table-cell">{p.grade}</TableCell>
                        <TableCell>${p.amount.toLocaleString()}</TableCell>
                        <TableCell className={p.dueAmount > 0 ? 'text-amber-600' : 'text-green-600'}>
                          ${p.dueAmount.toLocaleString()}
                        </TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {format(new Date(p.dueDate), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <div className="grid gap-4 sm:grid-cols-2">
            {loadingStruct ? <LoadingGrid count={2} /> : structures.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${s.amount.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.grade} · {s.frequency}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Due: {format(new Date(s.dueDate), 'MMM d, yyyy')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
