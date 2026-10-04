import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-lg border border-input bg-[rgba(255,255,255,0.03)] px-3.5 py-2.5 text-[0.9375rem] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-[rgba(0,255,136,0.55)] focus-visible:ring-[3px] focus-visible:ring-[rgba(0,255,136,0.12)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/40 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
