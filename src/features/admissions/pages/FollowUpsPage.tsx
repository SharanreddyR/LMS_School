import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { FollowUpCard } from '../components/FollowUpCard'
import { AdmissionsEmptyState } from '../components/AdmissionsEmptyState'
import { useAdmissions } from '../hooks/useAdmissions'
import { isPast, isToday } from 'date-fns'

export function FollowUpsPage() {
  const admissions = useAdmissions()
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('pending')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return admissions.followUps.filter((f) => {
      const q = search.toLowerCase()
      if (q && !f.title.toLowerCase().includes(q) && !f.leadName.toLowerCase().includes(q)) {
        return false
      }
      const due = new Date(f.dueDate)
      if (filter === 'pending') return !f.completed
      if (filter === 'completed') return f.completed
      if (filter === 'overdue') return !f.completed && isPast(due) && !isToday(due)
      return true
    })
  }, [admissions.followUps, filter, search])

  const handleLeadClick = (leadId: string) => {
    const lead = admissions.leads.find((l) => l.id === leadId)
    if (lead) admissions.setSelectedLead(lead)
  }

  return (
    <AdmissionsPageShell
      title="Follow-ups"
      description="Track calls, emails, visits, and meetings with prospective families"
      actions={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Schedule Follow-up
        </Button>
      }
      selectedLead={admissions.selectedLead}
      onCloseLead={() => admissions.setSelectedLead(null)}
      onStageChange={admissions.updateLeadStage}
      onAddNote={admissions.addNote}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search follow-ups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            wrapperClassName="w-full sm:w-44"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </Select>
          <p className="text-sm text-muted-foreground sm:ml-auto">
            <span className="font-medium text-foreground">{filtered.length}</span> follow-ups
          </p>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">By Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {admissions.loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <AdmissionsEmptyState
                title="No follow-ups"
                description="You're all caught up! Schedule a new follow-up when needed."
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <FollowUpCard
                    key={f.id}
                    followUp={f}
                    onToggle={admissions.toggleFollowUp}
                    onLeadClick={handleLeadClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            {admissions.loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(['urgent', 'high', 'medium', 'low'] as const).map((priority) => {
                  const items = filtered.filter((f) => f.priority === priority && !f.completed)
                  return (
                    <div key={priority} className="rounded-xl border border-border bg-muted/30 p-4">
                      <h3 className="mb-3 text-sm font-semibold capitalize">{priority}</h3>
                      {items.length === 0 ? (
                        <p className="text-xs text-muted-foreground">None</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => handleLeadClick(f.leadId)}
                              className="block w-full rounded-lg bg-card p-2 text-left text-sm shadow-sm hover:shadow-md transition-shadow"
                            >
                              {f.title}
                              <span className="mt-0.5 block text-xs text-muted-foreground">{f.leadName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdmissionsPageShell>
  )
}
