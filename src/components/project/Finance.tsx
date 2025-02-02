import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { fetchFinancialData, addFinancialItem, updateBudget } from "@/utils/api"
import { Frequency, FinancialItemType } from "@prisma/client"
import type { NewFinancialItem, FinancialData } from "@/utils/types"

export default function Finance({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const [newItem, setNewItem] = useState<NewFinancialItem>({
    projectId,
    type: FinancialItemType.EXPENSE,
    category: "",
    description: "",
    amount: 0,
    frequency: Frequency.ONE_TIME,
    linkedTo: "",
    date: "",
  })
  const [budget, setBudget] = useState("")

  const {
    data: financialData,
    isLoading,
    isError,
  } = useQuery<FinancialData>({
    queryKey: ["financialData", projectId],
    queryFn: () => fetchFinancialData(projectId),
  })

  const addItemMutation = useMutation<FinancialData, Error, NewFinancialItem>({
    mutationFn: (data: NewFinancialItem) => addFinancialItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialData", projectId] })
      setNewItem({
        projectId,
        type: FinancialItemType.EXPENSE,
        category: "",
        description: "",
        amount: 0,
        frequency: Frequency.ONE_TIME,
        linkedTo: "",
        date: "",
      })
    },
  })

  const updateBudgetMutation = useMutation<FinancialData, Error, { projectId: string; budget: number }>({
    mutationFn: (data: { projectId: string; budget: number }) => updateBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialData", projectId] })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value ? Number.parseFloat(value) : 0) : value,
    }))
  }

  const handleSelectChange = (name: keyof NewFinancialItem, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "type" ? (value as FinancialItemType) : name === "frequency" ? (value as Frequency) : value,
    }))
  }

  const handleAddItem = () => {
    addItemMutation.mutate(newItem)
  }

  const handleUpdateBudget = () => {
    updateBudgetMutation.mutate({ projectId, budget: Number.parseFloat(budget) })
  }

  const handleExportCSV = () => {
    if (!financialData) return

    const csvContent = [
      ["Type", "Category", "Description", "Amount", "Frequency", "Linked To", "Date"],
      ...financialData.items.map((item) => [
        item.type,
        item.category,
        item.description,
        item.amount,
        item.frequency,
        item.linkedTo || "",
        new Date(item.date).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `financial_data_${projectId}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isLoading) return <div>Loading financial data...</div>
  if (isError) return <div>Error loading financial data</div>
  if (!financialData) return null

  const totalIncome = financialData.items.reduce(
    (sum, item) => (item.type === FinancialItemType.INCOME ? sum + item.amount : sum),
    0,
  )
  const totalExpenses = financialData.items.reduce(
    (sum, item) => (item.type === FinancialItemType.EXPENSE ? sum + item.amount : sum),
    0,
  )
  const balance = totalIncome - totalExpenses

  const chartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
    { name: "Balance", amount: balance },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">${totalExpenses}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Balance</h3>
              <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${balance}
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
            />
            <Button onClick={handleUpdateBudget}>Update Budget</Button>
          </div>
          <p className="mt-2">
            Current Budget: ${Number(financialData.budget || 0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Linked To</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>{item.linkedTo}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Financial Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Select name="type" onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FinancialItemType.INCOME}>Income</SelectItem>
                <SelectItem value={FinancialItemType.EXPENSE}>Expense</SelectItem>
              </SelectContent>
            </Select>
            <Input name="category" value={newItem.category} onChange={handleInputChange} placeholder="Category" />
            <Input
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <Input
              name="amount"
              type="number"
              value={newItem.amount.toString()}
              onChange={handleInputChange}
              placeholder="Amount"
            />
            <Select name="frequency" onValueChange={(value) => handleSelectChange("frequency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Frequency).map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="linkedTo" value={newItem.linkedTo} onChange={handleInputChange} placeholder="Linked To" />
            <Input name="date" type="date" value={newItem.date} onChange={handleInputChange} />
          </div>
          <Button className="mt-4" onClick={handleAddItem}>
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleExportCSV}>Export to CSV</Button>
    </div>
  )
}

