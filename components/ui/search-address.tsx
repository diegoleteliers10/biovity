"use client"

import { ChevronsUpDown, LocationIcon, MapPinIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ParsedAddress } from "@/hooks/use-search-address"
import { useSearchAddress } from "@/hooks/use-search-address"
import { cn } from "@/lib/utils"

interface SearchAddressProps {
  onSelectLocation: (parsedAddress: ParsedAddress | null) => void
}

const typeLabels: Record<string, string> = {
  boundary: "Frontera",
  building: "Edificio",
  landuse: "Uso de suelo",
  natural: "Natural",
  place: "Lugar",
  poi: "Punto de interes",
  railway: "Ferrocarril",
  road: "Carretera",
  transit: "Transporte",
  waterway: "Curso de agua",
  other: "Otro",
}

export function SearchAddress({ onSelectLocation }: SearchAddressProps) {
  const { query, results, loading, handleSearch, selectedItem, parsedAddress, handleSelect } =
    useSearchAddress({ onSelectLocation })

  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen && !selectedItem) {
        handleSearch("")
      }
    },
    [handleSearch, selectedItem]
  )

  const displayValue = selectedItem
    ? `${parsedAddress?.street || ""}${parsedAddress?.city ? `, ${parsedAddress.city}` : ""}${parsedAddress?.country ? `, ${parsedAddress.country}` : ""}`.trim()
    : query

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedItem && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon
              icon={selectedItem ? MapPinIcon : Search01Icon}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="truncate">{displayValue || "Buscar direccion..."}</span>
          </div>
          <HugeiconsIcon icon={ChevronsUpDown} className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="flex items-center border-b px-3">
          <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={selectedItem ? parsedAddress?.street || selectedItem.label || query : query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar direccion..."
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {loading && (
            <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          )}
        </div>
        <ScrollArea className="h-72">
          {Object.keys(results).length === 0 && !loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {query ? "Sin resultados" : "Escribe para buscar una direccion"}
            </div>
          )}
          {Object.entries(results).map(([type, items]) => (
            <div key={type}>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {typeLabels[type] || type}
              </div>
              {items.map((item, index) => {
                const itemLabel = item.label || ""
                console.log("[SearchAddress] item.label:", itemLabel)
                return (
                  <button
                    key={`${type}-${index}`}
                    type="button"
                    onClick={() => {
                      console.log("[SearchAddress] clicking item:", itemLabel)
                      handleSelect(item)
                      setOpen(false)
                    }}
                    className="relative flex w-full cursor-pointer items-center gap-2 bg-transparent px-2 py-2 text-sm text-foreground outline-none select-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <HugeiconsIcon
                      icon={LocationIcon}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="truncate">{itemLabel}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}