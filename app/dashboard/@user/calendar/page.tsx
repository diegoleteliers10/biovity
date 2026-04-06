import { CalendarSection } from "@/components/dashboard/employee/calendar/calendar-section"
import { authClient } from "@/lib/auth-client"

export default function EmployeeCalendarPage() {
  return (
    <div className="p-4">
      <CalendarSection userRole="professional" />
    </div>
  )
}
