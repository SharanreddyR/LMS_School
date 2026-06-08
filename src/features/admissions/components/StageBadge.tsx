import { STAGE_LABELS, type PipelineStage } from '../types'

const STAGE_VARIANTS: Record<PipelineStage, string> = {
  enquiry: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  qualified: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  application: 'bg-amber-100 text-amber-700 border-amber-200',
  interview: 'bg-purple-100 text-purple-700 border-purple-200',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  enrolled: 'bg-green-100 text-green-800 border-green-200',
  lost: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STAGE_VARIANTS[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  )
}
