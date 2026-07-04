/* eslint-disable react-refresh/only-export-components -- re-exports Radix primitives alongside styled wrappers */
import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/utils/cn'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixDialog.Content>) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <RadixDialog.Content
      className={cn(
        'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
)

export const DialogHeader = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div className={cn('mb-4 flex flex-col space-y-1.5', className)} {...props} />
)

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Title>) => (
  <RadixDialog.Title
    className={cn('text-lg font-semibold text-slate-900', className)}
    {...props}
  />
)

export const DialogDescription = RadixDialog.Description
