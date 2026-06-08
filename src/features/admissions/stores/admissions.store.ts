import { create } from 'zustand'
import { MOCK_FOLLOW_UPS, MOCK_LEADS } from '../data/mock-data'
import type { AdmissionLead, FollowUp, Note, PipelineStage } from '../types'

interface AdmissionsState {
  leads: AdmissionLead[]
  followUps: FollowUp[]
  initialized: boolean
  init: () => void
  updateLeadStage: (leadId: string, stage: PipelineStage) => void
  addNote: (leadId: string, content: string) => void
  toggleFollowUp: (followUpId: string) => void
  convertToStudent: (leadId: string) => string
}

export const useAdmissionsStore = create<AdmissionsState>((set, get) => ({
  leads: [],
  followUps: [],
  initialized: false,

  init: () => {
    if (get().initialized) return
    set({ leads: MOCK_LEADS, followUps: MOCK_FOLLOW_UPS, initialized: true })
  },

  updateLeadStage: (leadId, stage) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage,
              updatedAt: new Date().toISOString(),
              activities: [
                {
                  id: `${leadId}-act-${Date.now()}`,
                  type: 'status_change',
                  description: `Stage changed to ${stage}`,
                  user: 'You',
                  createdAt: new Date().toISOString(),
                },
                ...l.activities,
              ],
            }
          : l,
      ),
    }))
  },

  addNote: (leadId, content) => {
    const note: Note = {
      id: `${leadId}-note-${Date.now()}`,
      content,
      author: 'You',
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              notes: [note, ...l.notes],
              activities: [
                {
                  id: `${leadId}-act-note-${Date.now()}`,
                  type: 'note',
                  description: 'Note added',
                  user: 'You',
                  createdAt: new Date().toISOString(),
                },
                ...l.activities,
              ],
            }
          : l,
      ),
    }))
  },

  toggleFollowUp: (followUpId) => {
    set((s) => ({
      followUps: s.followUps.map((f) =>
        f.id === followUpId ? { ...f, completed: !f.completed } : f,
      ),
    }))
  },

  convertToStudent: (leadId) => {
    const studentId = `STU-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage: 'enrolled',
              convertedStudentId: studentId,
              updatedAt: new Date().toISOString(),
              activities: [
                {
                  id: `${leadId}-act-convert-${Date.now()}`,
                  type: 'status_change',
                  description: `Converted to student ${studentId}`,
                  user: 'You',
                  createdAt: new Date().toISOString(),
                },
                ...l.activities,
              ],
            }
          : l,
      ),
    }))
    return studentId
  },
}))
