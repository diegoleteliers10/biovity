"use client"

import {
  Cash02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  Location05Icon,
  Search01Icon,
  StarIcon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/base/select/select"
import { DATA } from "@/lib/data/data-test"
import { AnimatePresence, motion } from "motion/react"

type JobItem = {
  id: number
  jobTitle: string
  company: string
  location: string
  salary: string
  postedTime: string
  tags: string[]
  additionalTags: number
  compatibility: number
  isSaved: boolean
}

const JOB_TYPES = [
  { id: "any", label: "Cualquier tipo" },
  { id: "full-time", label: "Tiempo completo" },
  { id: "part-time", label: "Medio tiempo" },
  { id: "contract", label: "Contrato" },
  { id: "internship", label: "Prácticas" },
]

const EXPERIENCE_LEVELS = [
  { id: "any", label: "Cualquier nivel" },
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Semi Senior" },
  { id: "senior", label: "Senior" },
]

// Tags filter removed per request

export const SearchContent = () => {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [jobType, setJobType] = useState<string>("any")
  const [experience, setExperience] = useState<string>("any")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Tags selection removed

  const handleSearch = () => {
    // In a real app, trigger API fetch here
  }

  const handleClear = () => {
    setQuery("")
    setLocation("")
    setRemoteOnly(false)
    setJobType("any")
    setExperience("any")
    setMinSalary("")
    setMaxSalary("")
    // cleared tags removed
  }

  const jobs: JobItem[] = DATA.recommendedJobs as unknown as JobItem[]

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    const loc = location.trim().toLowerCase()
    const min = Number(minSalary.replace(/[^0-9]/g, "")) || 0
    const max = Number(maxSalary.replace(/[^0-9]/g, "")) || Number.MAX_SAFE_INTEGER
    // no tag filters

    return jobs.filter((job) => {
      if (q && !(`${job.jobTitle} ${job.company}`.toLowerCase().includes(q))) return false
      if (loc && !job.location.toLowerCase().includes(loc)) return false
      if (remoteOnly && !/remoto|remote/.test(job.location.toLowerCase())) return false

      // Simulated jobType/experience filter (no fields in sample): accept all unless specific
      if (jobType !== "any") {
        // placeholder rule: filter by presence of certain keywords in tags
        if (!job.tags.some((t) => t.toLowerCase().includes(jobType.split("-")[0]))) return false
      }
      if (experience !== "any") {
        if (!job.tags.some((t) => t.toLowerCase().includes(experience))) return false
      }

      // Salary parsing (sample has ranges as text). Extract numbers and compare mid value
      const match = job.salary.match(/(\d+[\d,.]*)\s*-\s*(\d+[\d,.]*)/)
      if (match) {
        const low = Number(match[1].replace(/[^0-9]/g, "")) || 0
        const high = Number(match[2].replace(/[^0-9]/g, "")) || 0
        const mid = (low + high) / 2
        if (mid < min || mid > max) return false
      }

      // tag filters removed

      return true
    })
  }, [query, location, remoteOnly, jobType, experience, minSalary, maxSalary, jobs])

  const handleSave = (job: JobItem) => {
    console.log("save", job.id)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Buscar Empleos</h1>
          <p className="text-muted-foreground text-sm">
            Encuentra oportunidades acorde a tus preferencias.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Buscador y filtros</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Refina tu búsqueda por palabra clave, ubicación y preferencias.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-foreground">
              Limpiar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Título, empresa o palabra clave"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar por palabra clave"
                />
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"
                  aria-hidden
                />
              </div>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Ubicación (ciudad, país o remoto)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Filtrar por ubicación"
              />
            </div>
            <div className="flex items-stretch gap-2">
              <Button onClick={handleSearch} aria-label="Buscar" className="px-5">
                <HugeiconsIcon icon={Search01Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
                Buscar
              </Button>
              <Button
                variant="outline"
                className="px-4"
                aria-label="Mostrar filtros avanzados"
                aria-expanded={showAdvanced}
                onClick={() => setShowAdvanced((v) => !v)}
              >
                <HugeiconsIcon icon={FilterHorizontalIcon} size={24} strokeWidth={1.5} className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                key="advanced-filters"
                initial={{ 
                  opacity: 0, 
                  y: -10, 
                  scale: 0.97
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  y: -6, 
                  scale: 0.97,
                  transition: { 
                    duration: 0.2, 
                    ease: [0.4, 0, 0.2, 1]
                  } 
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.4, 0, 0.2, 1],
                  opacity: {
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1]
                  },
                  y: {
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1]
                  },
                  scale: {
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }
                }}
                className="rounded-lg border border-border/60 bg-card p-3 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <Select
                  selectedKey={jobType}
                  onSelectionChange={(key) => setJobType(String(key))}
                  items={JOB_TYPES}
                  placeholder="Tipo de empleo"
                  size="md"
                >
                  {(item) => <Select.Item id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                  </Select>

                  <Select
                  selectedKey={experience}
                  onSelectionChange={(key) => setExperience(String(key))}
                  items={EXPERIENCE_LEVELS}
                  placeholder="Experiencia"
                  size="md"
                >
                  {(item) => <Select.Item id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                  </Select>

                  <div className="flex gap-2">
                    <Input
                    inputMode="numeric"
                    placeholder="Salario mín."
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    aria-label="Salario mínimo"
                    className="h-11"
                    />
                    <Input
                    inputMode="numeric"
                    placeholder="Salario máx."
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    aria-label="Salario máximo"
                    className="h-11"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                    <span className="text-sm text-muted-foreground">Solo remoto</span>
                    <Checkbox
                    aria-label="Solo remoto"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.currentTarget.checked)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MultiSelect removed */}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredJobs.length} resultados
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="relative overflow-hidden flex flex-col border-border/60 hover:border-border transition-colors duration-200 group"
          >
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                  <CardTitle className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2">
                    {job.jobTitle}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {job.compatibility}% compatibilidad
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-md hover:bg-primary/10"
                    onClick={() => handleSave(job)}
                    aria-label={`Guardar ${job.jobTitle}`}
                  >
                    <HugeiconsIcon icon={Bookmark02Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3 flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Location05Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                  <span className="truncate">{job.postedTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Cash02Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                  <span className="truncate">{job.salary}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={StarIcon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                  <span className="truncate">Relevante</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {job.tags.slice(0, 2).map((tag) => (
                  <span
                    key={`${job.id}-${tag}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {job.additionalTags > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    +{job.additionalTags}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SearchContent


