"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { fetchFinancialData, addFinancialItem, updateBudget } from "@/utils/api"
import { Frequency, FinancialItemType } from "@prisma/client"
import type { NewFinancialItem, FinancialData, FinancialItem } from "@/utils/types"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Finance({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isUpdateBudgetOpen, setIsUpdateBudgetOpen] = useState(false)
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

  const addItemMutation = useMutation<any, Error, NewFinancialItem>({
    mutationFn: (data: NewFinancialItem) => addFinancialItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialData", projectId] })
      setIsAddItemOpen(false)
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

  const updateBudgetMutation = useMutation<any, Error, { projectId: string; budget: number }>({
    mutationFn: (data: { projectId: string; budget: number }) => updateBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialData", projectId] })
      setIsUpdateBudgetOpen(false)
      setBudget("")
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
      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6`}>
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4 mb-4`}>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Income</h3>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expenses</h3>
                <p className="text-2xl font-bold text-red-600">${Number.parseFloat(totalExpenses).toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className={`flex ${isMobile ? "flex-col" : "justify-between"} items-center mb-4`}>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Budget</h3>
                <p className="text-2xl font-bold">${Number(financialData.budget || 0).toFixed(2)}</p>
              </div>
              <Button onClick={() => setIsUpdateBudgetOpen(true)}>Update Budget</Button>
            </div>
            <Button onClick={() => setIsAddItemOpen(true)} className="w-full">
              Add Financial Item
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`h-${isMobile ? "48" : "64"}`}>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Items</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialItemsTable items={financialData.items} isMobile={isMobile} />
        </CardContent>
      </Card>

      <AddItemDialog
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        newItem={newItem}
        setNewItem={setNewItem}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleAddItem={handleAddItem}
      />

      <UpdateBudgetDialog
        isOpen={isUpdateBudgetOpen}
        onClose={() => setIsUpdateBudgetOpen(false)}
        budget={budget}
        setBudget={setBudget}
        handleUpdateBudget={handleUpdateBudget}
        currentBudget={financialData.budget || 0}
      />
    </div>
  )
}

function FinancialItemsTable({ items, isMobile }: { items: FinancialItem[]; isMobile: boolean }) {
  return (
    <div className={isMobile ? "overflow-x-auto" : ""}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            {!isMobile && (
              <>
                <TableHead>Frequency</TableHead>
                <TableHead>Linked To</TableHead>
                <TableHead>Date</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${Number.parseFloat(item.amount).toFixed(2)}</TableCell>
              {!isMobile && (
                <>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>{item.linkedTo}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AddItemDialog({
  isOpen,
  onClose,
  newItem,
  setNewItem,
  handleInputChange,
  handleSelectChange,
  handleAddItem,
}: {
  isOpen: boolean
  onClose: () => void
  newItem: NewFinancialItem
  setNewItem: React.Dispatch<React.SetStateAction<NewFinancialItem>>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (name: keyof NewFinancialItem, value: string) => void
  handleAddItem: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Financial Item</DialogTitle>
        </DialogHeader>
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
        <Button className="mt-4 w-full" onClick={handleAddItem}>
          Add Item
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function UpdateBudgetDialog({
  isOpen,
  onClose,
  budget,
  setBudget,
  handleUpdateBudget,
  currentBudget,
}: {
  isOpen: boolean
  onClose: () => void
  budget: string
  setBudget: React.Dispatch<React.SetStateAction<string>>
  handleUpdateBudget: () => void
  currentBudget: number
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={`Current budget: $${Number.parseFloat(currentBudget).toFixed(2)}`}
          />
          <Button className="w-full" onClick={handleUpdateBudget}>
            Update Budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

