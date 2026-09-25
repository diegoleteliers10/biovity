"use client"

import { memo } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export type TrendPoint = {
  date: string
  professionals: number
  organizations: number
}

export type TopJobPoint = {
  jobId: string
  title: string
  organizationName: string
  applications: number
  views: number
  applicationRate: number
}

const BAR_COLORS = ["#10b981", "#3b82f6"]

export const RegistrationsChart = memo(function RegistrationsChart({
  data,
  interval,
}: {
  data: TrendPoint[]
  interval: number
}) {
  return (
    <ResponsiveContainer width="100%" height={208}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={interval}
        />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="professionals"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.7}
          name="Profesionales"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="organizations"
          stackId="2"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.7}
          name="Organizaciones"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
})

export const TopJobsChart = memo(function TopJobsChart({ data }: { data: TopJobPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={208}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="title"
          type="category"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={120}
          interval={0}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          labelStyle={{ fontWeight: 600 }}
          formatter={(value, name) => [`${value} postulaciones`, name]}
        />
        <Bar
          dataKey="applications"
          name="Postulaciones"
          fill="#10b981"
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        >
          {data.map((job, index) => (
            <Cell key={job.jobId} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
})
