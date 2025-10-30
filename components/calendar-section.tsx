"use client"

import { useState } from "react"
import { Calendar } from "./calendar"
import { UpcomingEvents } from "./upcoming-events"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-3">
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-card-foreground">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="text-sm px-3">
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <Calendar currentDate={currentDate} />
          </div>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="lg:col-span-1">
        <UpcomingEvents />
      </div>
    </div>
  )
}
