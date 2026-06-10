import { useState, useEffect } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Sheet } from '@/components/ui/sheet'
import type { AdmissionLead } from '../types'
import type { FeePaymentMode } from '../types/application'
import { INSTALLMENT_MINIMUM } from '../types/application'

interface FeePaymentSheetProps {
  lead: AdmissionLead | null
  open: boolean
  onClose: () => void
  onSubmit: (leadId: string, amount: number, mode: FeePaymentMode) => void
}

export function FeePaymentSheet({ lead, open, onClose, onSubmit }: FeePaymentSheetProps) {
  const [mode, setMode] = useState<FeePaymentMode>('full')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (open && lead?.fee) {
      const remaining = lead.fee.totalAmount - lead.fee.paidAmount
      setMode(remaining === lead.fee.totalAmount ? 'full' : 'installment')
      setAmount(String(remaining === lead.fee.totalAmount ? lead.fee.totalAmount : INSTALLMENT_MINIMUM))
    }
  }, [open, lead])

  if (!lead?.fee) return null

  const { fee } = lead
  const remaining = fee.totalAmount - fee.paidAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (!parsed || parsed <= 0 || parsed > remaining) return
    if (mode === 'installment' && parsed < INSTALLMENT_MINIMUM && remaining > INSTALLMENT_MINIMUM) return
    onSubmit(lead.id, parsed, mode)
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Record Fee Payment"
      description={`${lead.studentName} · Admission fee for ${lead.gradeApplying}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-4">
        <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total fee</span>
            <span className="font-semibold">₹{fee.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Already paid</span>
            <span className="font-medium text-green-700">₹{fee.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-medium">Remaining</span>
            <span className="font-bold">₹{remaining.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Payment Type</label>
          <Select
            value={mode}
            onChange={(e) => {
              const next = e.target.value as FeePaymentMode
              setMode(next)
              setAmount(String(next === 'full' ? remaining : Math.min(INSTALLMENT_MINIMUM, remaining)))
            }}
          >
            <option value="full">Full Payment</option>
            <option value="installment">Installment Payment</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Amount (₹)</label>
          <Input
            type="number"
            min={mode === 'installment' ? Math.min(INSTALLMENT_MINIMUM, remaining) : 1}
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {mode === 'installment' && remaining > INSTALLMENT_MINIMUM && (
            <p className="text-xs text-muted-foreground">
              Minimum installment: ₹{INSTALLMENT_MINIMUM.toLocaleString()}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          After payment, the applicant can be converted to a student from the enquiry details or
          Conversion page.
        </p>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Wallet className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </form>
    </Sheet>
  )
}
