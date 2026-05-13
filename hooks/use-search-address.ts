import { OpenStreetMapProvider } from "leaflet-geosearch"
import { useCallback, useEffect, useMemo, useState } from "react"

import { useDebounce } from "./use-debounce"

export interface ParsedAddress {
  street: string
  city: string
  country: string
  latitude: number
  longitude: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SearchResult = Record<string, any>

interface UseSearchAddressOptions {
  onSelectLocation?: (parsed: ParsedAddress | null) => void
}

interface UseSearchAddressReturn {
  query: string
  results: Record<string, SearchResult[]>
  loading: boolean
  handleSearch: (value: string) => void
  selectedItem: SearchResult | null
  setSelectedItem: (item: SearchResult | null) => void
  parsedAddress: ParsedAddress | null
  handleSelect: (item: SearchResult) => void
}

const provider = new OpenStreetMapProvider()

export function useSearchAddress({
  onSelectLocation,
}: UseSearchAddressOptions = {}): UseSearchAddressReturn {
  const [query, setQuery] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawResults, setRawResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null)
  const [parsedAddress, setParsedAddress] = useState<ParsedAddress | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  const results = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped: Record<string, SearchResult[]> = {}
    for (const result of rawResults) {
      const key = result.raw?.class || "other"
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(result)
    }
    return grouped
  }, [rawResults])

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setRawResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const searchResults = await provider.search({ query: searchQuery })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRawResults(searchResults as SearchResult[])
    } catch {
      setRawResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery)
    } else {
      setRawResults([])
    }
  }, [debouncedQuery, search])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseAddress = useCallback((item: SearchResult | null): ParsedAddress | null => {
    if (!item) return null

    const label = item.label || ""
    const parts = label.split(",").map((p: string) => p.trim())
    console.log("[parseAddress] parts:", parts)

    // Simple parsing from parts array
    // parts[0] = number, parts[1] = street, parts[2] = suburb, parts[3] = city/district
    // parts[4] = province, parts[5] = region, parts[6] = postcode, parts[7] = country

    const numberPart = parts.find((p: string) => /^\d+$/.test(p)) || ""
    const streetPart = parts.find(
      (p: string) =>
        p.toLowerCase().includes("avenida") ||
        p.toLowerCase().includes("calle") ||
        p.toLowerCase().includes("av ") ||
        p.toLowerCase().includes("pasaje") ||
        p.toLowerCase().includes("jiron")
    ) || ""

    const street = streetPart && numberPart
      ? `${streetPart} ${numberPart}`
      : streetPart || parts[1] || ""

    // City: use parts[5] from the address parts array (positions 0-7)
    const city = parts[5] || ""

    // Country is always last
    const country = parts[parts.length - 1] || ""

    return { street, city, country, latitude: item.y, longitude: item.x }
  }, [])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const handleSelect = useCallback(
    (item: SearchResult) => {
      console.log("[handleSelect] item:", item)
      const parsed = parseAddress(item)
      console.log("[handleSelect] parsed:", parsed)
      if (parsed) {
        setSelectedItem(item)
        setParsedAddress(parsed)
        onSelectLocation?.(parsed)
      }
    },
    [parseAddress, onSelectLocation]
  )

  return {
    query,
    results,
    loading,
    handleSearch,
    selectedItem,
    setSelectedItem,
    parsedAddress,
    handleSelect,
  }
}
