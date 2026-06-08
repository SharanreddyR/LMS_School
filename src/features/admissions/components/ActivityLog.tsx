import { format } from 'date-fns'
import {
  Phone,
  Mail,
  FileText,
  Users,
  ArrowRight,
  StickyNote,
  Calendar,
} from 'lucide-react'
import type { Activity } from '../types'

const ACTIVITY_CONFIG: Record<Activity['type'], { icon: typeof Phone; color: string }> = {
  call: { icon: Phone, color: 'text-blue-600 bg-blue-50' },
  email: { icon: Mail, color: 'text-indigo-600 bg-indigo-50' },
  document: { icon: FileText, color: 'text-amber-600 bg-amber-50' },
  meeting: { icon: Users, color: 'text-purple-600 bg-purple-50' },
  status_change: { icon: ArrowRight, color: 'text-emerald-600 bg-emerald-50' },
  note: { icon: StickyNote, color: 'text-slate-600 bg-slate-50' },
  follow_up: { icon: Calendar, color: 'text-orange-600 bg-orange-50' },
}

interface ActivityLogProps {
  activities: Activity[]
}

export function ActivityLog({ activities }: ActivityLogProps) {
  if (activities.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No activity yet</p>
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = ACTIVITY_CONFIG[activity.type]
        const Icon = config.icon
        return (
          <div key={activity.id} className="flex gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 border-b border-border pb-3 last:border-0">
              <p className="text-sm">{activity.description}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activity.user} · {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
