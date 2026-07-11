import * as React from "react"

interface CommonControlledStateProps<T> {
  value?: T
  defaultValue?: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useControlledState<T, Rest extends any[] = []>(
  props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void
  }
): readonly [T, (next: T, ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props

  const [uncontrolledState, setUncontrolledState] = React.useState<T>(
    value !== undefined ? value : (defaultValue as T)
  )

  const isControlled = value !== undefined
  const state = isControlled ? (value as T) : (uncontrolledState as T)

  const setState = React.useCallback(
    (next: T, ...args: Rest) => {
      if (!isControlled) setUncontrolledState(next)
      onChange?.(next, ...args)
    },
    [isControlled, onChange]
  )

  return [state, setState] as const
}
