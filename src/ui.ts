const controlBase = 'w-full min-w-0 max-w-full rounded-xl border bg-white text-sm text-ink shadow-sm'

export const fieldClass = `${controlBase} h-11 border-line px-3`
export const fieldErrorClass = `${controlBase} h-11 border-clay px-3`
export const searchFieldClass = `${controlBase} h-11 border-line pr-3 pl-9`
export const textareaClass = `${controlBase} min-h-24 resize-y border-line px-3 py-2`
export const textareaErrorClass = `${controlBase} min-h-24 resize-y border-clay px-3 py-2`

export const labelClass = 'mb-1.5 block text-sm font-medium text-ink'
export const errorTextClass = 'mt-1.5 text-sm text-clay'

export const primaryButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-sm hover:bg-accent-strong'

export const secondaryButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink shadow-sm hover:bg-canvas'

export const dangerButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-clay px-4 text-sm font-semibold text-white shadow-sm hover:bg-clay-strong'

export const quietButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-canvas'

export const dangerQuietButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-medium text-clay hover:bg-clay-soft'

export function inputClass(hasError: boolean): string {
  return hasError ? fieldErrorClass : fieldClass
}

export function noteClass(hasError: boolean): string {
  return hasError ? textareaErrorClass : textareaClass
}
