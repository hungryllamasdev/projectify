"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { FinancialData } from "@/utils/types"
import type { TaskStatus } from "@prisma/client"

interface FinancialMetricsProps {
  taskData: {
    status: TaskStatus
    count: number
  }[]
  financialData: FinancialData
}

export default function FinancialMetrics({ taskData, financialData }: FinancialMetricsProps) {
  const totalIncome = financialData.items.reduce(
    (sum, item) => (item.type === "INCOME" ? sum + Number(item.amount) : sum),
    0,
  )
  const totalExpenses = financialData.items.reduce(
    (sum, item) => (item.type === "EXPENSE" ? sum + Number(item.amount) : sum),
    0,
  )
  const balance = totalIncome - totalExpenses
  const budgetUtilization = (totalExpenses / (financialData.budget || 0)) * 100 

  const financialChartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
    { name: "Balance", amount: balance },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial & Task Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget Utilization</p>
            <p className="text-2xl font-bold">{budgetUtilization.toFixed(2)}%</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

