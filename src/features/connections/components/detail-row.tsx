import { cn } from '@/utils/cn'

type DetailRowProps = {
  label: string
  value: string
  valueClassName?: string
}

export const DetailRow = ({ label, value, valueClassName }: DetailRowProps) => (
  <div className="flex justify-between">
    <span className="text-[11px] text-ink-muted">{label}</span>
    <span
      className={cn('font-mono text-[11px] text-ink-faint', valueClassName)}
    >
      {value}
    </span>
  </div>
)
