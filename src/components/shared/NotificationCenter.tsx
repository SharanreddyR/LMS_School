import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Check, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fetchNotifications } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/mock-api/types'

const TYPE_CONFIG = {
  info: { icon: Info, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  success: { icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
  error: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: fetchNotifications,
  })

  const markAllRead = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 200))
      return notifications.map((n) => ({ ...n, read: true }))
    },
    onSuccess: (data) => queryClient.setQueryData(queryKeys.notifications.all, data),
  })

  const unread = notifications.filter((n) => !n.read).length

  const handleClick = (n: Notification) => {
    if (n.link) {
      navigate(n.link)
      setOpen(false)
    }
    queryClient.setQueryData<Notification[]>(queryKeys.notifications.all, (old) =>
      old?.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:w-96">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-semibold">Notifications</h3>
              {unread > 0 && (
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => markAllRead.mutate()}>
                  <Check className="h-3 w-3" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</p>
              ) : (
                notifications.map((n) => {
                  const config = TYPE_CONFIG[n.type]
                  const Icon = config.icon
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleClick(n)}
                      className={cn(
                        'flex w-full gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 last:border-0',
                        !n.read && 'bg-brand-50/50 dark:bg-brand-900/10',
                      )}
                    >
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm', !n.read && 'font-semibold')}>{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
