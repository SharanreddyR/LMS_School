import { useState } from 'react'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import type { Note } from '../types'

interface NotesSectionProps {
  notes: Note[]
  onAddNote: (content: string) => void
}

export function NotesSection({ notes, onAddNote }: NotesSectionProps) {
  const [draft, setDraft] = useState('')

  const handleSubmit = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onAddNote(trimmed)
    setDraft('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          className="min-h-[60px]"
        />
        <Button
          size="icon"
          className="shrink-0 self-end"
          onClick={handleSubmit}
          disabled={!draft.trim()}
          aria-label="Add note"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No notes yet</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Avatar name={note.author} size="sm" />
                <div>
                  <p className="text-sm font-medium">{note.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
