import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"

import { useDebounce } from "./use-debounce"

export interface ParsedAddress {
  label: string
  street: string
  city: string
  state?: string
  country: string
  zipCode?: string
  latitude: number
  longitude: number
}

export interface SearchResult {
  label: string
  x: number
  y: number
  type: string
  address: {
    houseNumber?: string
    road?: string
    city?: string
    state?: string
    country?: string
    postcode?: string
  }
}

interface PhotonProperties {
  osm_id: number
  osm_type: string
  osm_key: string
  osm_value: string
  name?: string
  housenumber?: string
  street?: string
  postcode?: string
  city?: string
  state?: string
  country?: string
  county?: string
  district?: string
  suburb?: string
  village?: string
  town?: string
  municipality?: string
  locality?: string
}

interface PhotonFeature {
  geometry: {
    coordinates: [number, number]
    type: string
  }
  properties: PhotonProperties
}

interface PhotonResponse {
  features: PhotonFeature[]
}

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

const PHOTON_ENDPOINT = "https://photon.komoot.io/api/"

const pickCity = (p: PhotonProperties): string =>
  p.city ?? p.town ?? p.village ?? p.municipality ?? p.county ?? p.district ?? p.suburb ?? ""

const buildLabel = (p: PhotonProperties): string => {
  const parts: string[] = []
  if (p.street && p.housenumber) {
    parts.push(`${p.street} ${p.housenumber}`)
  } else {
    parts.push(p.street ?? p.name ?? "")
  }
  const city = pickCity(p)
  if (city) parts.push(city)
  if (p.state) parts.push(p.state)
  if (p.country) parts.push(p.country)
  return parts.filter(Boolean).join(", ")
}

const toSearchResult = (feature: PhotonFeature): SearchResult => {
  const { properties, geometry } = feature
  const [longitude, latitude] = geometry.coordinates
  return {
    label: buildLabel(properties),
    x: longitude,
    y: latitude,
    type: properties.osm_key,
    address: {
      houseNumber: properties.housenumber,
      road: properties.street,
      city: pickCity(properties),
      state: properties.state,
      country: properties.country,
      postcode: properties.postcode,
    },
  }
}

const queryAddresses = async (q: string): Promise<SearchResult[]> => {
  const url = new URL(PHOTON_ENDPOINT)
  url.searchParams.set("q", q)
  url.searchParams.set("limit", "8")

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error al consultar Photon: ${response.status}`)
  }

  const data = (await response.json()) as PhotonResponse
  return (data.features ?? []).map(toSearchResult)
}

export function useSearchAddress({
  onSelectLocation,
}: UseSearchAddressOptions = {}): UseSearchAddressReturn {
  const [query, setQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null)
  const [parsedAddress, setParsedAddress] = useState<ParsedAddress | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  const { data: rawResults = [], isFetching: loading } = useQuery({
    queryKey: ["address-search", debouncedQuery],
    queryFn: () => queryAddresses(debouncedQuery),
    enabled: Boolean(debouncedQuery.trim()),
    staleTime: 60_000,
  })

  const results = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {}
    for (const result of rawResults) {
      const key = result.type || "other"
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(result)
    }
    return grouped
  }, [rawResults])

  const parseAddress = useCallback((item: SearchResult | null): ParsedAddress | null => {
    if (!item) return null

    const { address, label } = item
    const road = address.road ?? ""
    const houseNumber = address.houseNumber ?? ""
    const street = road && houseNumber ? `${road} ${houseNumber}` : road

    return {
      label,
      street,
      city: address.city ?? "",
      state: address.state ?? "",
      country: address.country ?? "",
      zipCode: address.postcode ?? "",
      latitude: item.y,
      longitude: item.x,
    }
  }, [])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const handleSelect = useCallback(
    (item: SearchResult) => {
      const parsed = parseAddress(item)
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
