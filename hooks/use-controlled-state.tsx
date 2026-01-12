import * as React from "react"

type CommonControlledStateProps<T> = {
  readonly value?: T
  readonly defaultValue?: T
}

export function useControlledState<T, Rest extends readonly unknown[] = readonly []>(
  props: CommonControlledStateProps<T> & {
    readonly onChange?: (value: T, ...args: Rest) => void
  }
): readonly [T, (next: T, ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props

  const [state, setInternalState] = React.useState<T>(
    value !== undefined ? value : (defaultValue ?? (undefined as unknown as T))
  )

  React.useEffect(() => {
    if (value !== undefined) setInternalState(value)
  }, [value])

  const setState = React.useCallback(
    (next: T, ...args: Rest) => {
      setInternalState(next)
      onChange?.(next, ...args)
    },
    [onChange]
  )

  return [state, setState] as const
}
