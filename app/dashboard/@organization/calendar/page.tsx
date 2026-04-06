import { CalendarSection } from "@/components/dashboard/employee/calendar/calendar-section"

export default function OrganizationCalendarPage() {
  return (
    <div className="p-4">
      <CalendarSection userRole="organization" />
    </div>
  )
}
