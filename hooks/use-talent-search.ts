"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const SEARCH_DEBOUNCE_MS = 400

interface UseTalentSearchOptions {
  initialValue: string
  onSearchChange: (value: string) => void
}

interface UseTalentSearchReturn {
  inputSearch: string
  handleSearchChange: (value: string) => void
}

export function useTalentSearch({
  initialValue,
  onSearchChange,
}: UseTalentSearchOptions): UseTalentSearchReturn {
  const [inputSearch, setInputSearch] = useState(initialValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onSearchChange(value)
        debounceRef.current = null
      }, SEARCH_DEBOUNCE_MS)
    },
    [onSearchChange]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputSearch(value)
      fetchSearch(value)
    },
    [fetchSearch]
  )

  return { inputSearch, handleSearchChange }
}
