'use client'

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronDown,
  ChevronUp,
  Filter,
  LayersIcon,
  MessageSquare,
  PlusCircle,
  Search,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Type for sales data
type SaleData = {
  id: string
  createdAt: string
  client: { name: string; status: string }
  location: string
  salesRep: string
  total: string
  saleStatus: string
  workflow: string
  stockVerification: string
  completion: number
}

type GroupHeader = {
  id: string
  isGroupHeader: true
}

type ProcessedSaleData = SaleData | GroupHeader

// Sample data
const initialSalesData: SaleData[] = [
  {
    id: "SO168910",
    createdAt: "Oct 22, 2024, 10:40",
    client: { name: "Ivana Silvestro", status: "Premium" },
    location: "New York, USA",
    salesRep: "Bodini Carla",
    total: "€2,991.80",
    saleStatus: "Quotation",
    workflow: "Stock Verification",
    stockVerification: "Awaiting Availability",
    completion: 25,
  },
  {
    id: "ECOMMSO168899",
    createdAt: "Oct 22, 2024, 10:40",
    client: { name: "Claude Munini", status: "Client" },
    location: "Paris, France",
    salesRep: "Mollura Stefania",
    total: "€804.92",
    saleStatus: "Quotation Sent",
    workflow: "Stock Verification",
    stockVerification: "Partially Available",
    completion: 50,
  },
  {
    id: "SO168967",
    createdAt: "Oct 22, 2024, 10:40",
    client: { name: "John Doe", status: "Client" },
    location: "Zurich, Switzerland",
    salesRep: "Vanni Monica",
    total: "€3,500.00",
    saleStatus: "Quotation Approved",
    workflow: "Confirmed Order",
    stockVerification: "Available",
    completion: 25,
  },
  {
    id: "SO168974",
    createdAt: "Oct 22, 2024, 10:40",
    client: { name: "Keuley Huang", status: "Client" },
    location: "Taipei, Taiwan",
    salesRep: "Pinna Diana",
    total: "€195.84",
    saleStatus: "Sales Order",
    workflow: "Delivered Order",
    stockVerification: "Completed",
    completion: 75,
  },
  {
    id: "SO168744",
    createdAt: "Oct 22, 2024, 10:40",
    client: { name: "Anna Schmidt", status: "New" },
    location: "Munich, Germany",
    salesRep: "Vanni Monica",
    total: "€3,900.00",
    saleStatus: "Sales Order",
    workflow: "Completed Order",
    stockVerification: "Completed",
    completion: 100,
  },
]

export default function Component() {
  const [selectedTab, setSelectedTab] = React.useState("table")
  const { theme, setTheme } = useTheme()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filters, setFilters] = React.useState<{ [key: string]: string[] }>({})
  const [groupBy, setGroupBy] = React.useState<keyof SaleData | null>(null)
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof SaleData; direction: 'asc' | 'desc' } | null>(null)
  const [salesData] = React.useState(initialSalesData)

  // Search function
  const searchData = React.useCallback((data: SaleData[]): SaleData[] => {
    if (!searchTerm) return data
    return data.filter((item) => {
      const searchableValues = [
        item.id,
        item.createdAt,
        item.client.name,
        item.client.status,
        item.location,
        item.salesRep,
        item.total,
        item.saleStatus,
        item.workflow,
        item.stockVerification,
        item.completion.toString()
      ]
      return searchableValues.some(value => 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [searchTerm])

  // Filter function
  const filterData = React.useCallback((data: SaleData[]): SaleData[] => {
    return data.filter((item) =>
      Object.entries(filters).every(([key, values]) =>
        values.length === 0 || values.includes(String(item[key as keyof SaleData]))
      )
    )
  }, [filters])

  // Group function
  const groupData = React.useCallback((data: SaleData[]): ProcessedSaleData[] => {
    if (!groupBy) return data
    const grouped = data.reduce((acc, item) => {
      const key = String(item[groupBy])
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as { [key: string]: SaleData[] })
    
    return Object.entries(grouped).flatMap(([key, items]) => [
      { id: key, isGroupHeader: true } as GroupHeader,
      ...items
    ])
  }, [groupBy])

  // Sort function
  const sortData = React.useCallback((data: SaleData[]): SaleData[] => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [sortConfig])

  // Apply all transformations
  const processedData = React.useMemo(() => {
    let result = salesData
    result = searchData(result)
    result = filterData(result)
    result = sortData(result)
    return groupData(result)
  }, [salesData, searchData, filterData, sortData, groupData])

  // Handle sort change
  const handleSort = (key: keyof SaleData) => {
    setSortConfig((prevSort) =>
      prevSort && prevSort.key === key
        ? { key, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-lg font-semibold">Sales</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="border-b">
          <div className="flex flex-col md:flex-row items-center px-4 py-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[150px] pl-8 md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {['saleStatus', 'workflow', 'stockVerification'].map((key) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={filters[key]?.includes(key)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          [key]: checked
                            ? [...(prev[key] || []), key]
                            : (prev[key] || []).filter((item) => item !== key),
                        }))
                      }}
                    >
                      {key}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LayersIcon className="mr-2 h-4 w-4" />
                    Group by
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {['saleStatus', 'workflow', 'stockVerification', 'salesRep'].map((key) => (
                    <DropdownMenuItem key={key} onSelect={() => setGroupBy(key as keyof SaleData)}>
                      {key}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]" onClick={() => handleSort('id')}>
                    Sales {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                  </TableHead>
                  <TableHead onClick={() => handleSort('createdAt')}>
                    Created at {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead onClick={() => handleSort('total')}>
                    Total {sortConfig?.key === 'total' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                  </TableHead>
                  <TableHead>Sale Status</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Stock Verification</TableHead>
                  <TableHead onClick={() => handleSort('completion')}>
                    Completion {sortConfig?.key === 'completion' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {processedData.map((sale) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {'isGroupHeader' in sale ? (
                        <TableCell colSpan={10} className="font-bold bg-muted">
                          {sale.id}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell className="font-medium whitespace-nowrap">{sale.id}</TableCell>
                          <TableCell className="truncate max-w-[80px] md:max-w-[120px]" title={sale.createdAt}>
                            {sale.createdAt}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[80px] md:max-w-[100px]" title={sale.client.name}>
                                {sale.client.name}
                              </span>
                              <Badge className="whitespace-nowrap" variant={sale.client.status === "Premium" ? "default" : "secondary"}>
                                {sale.client.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[80px] md:max-w-[100px]" title={sale.location}>
                            {sale.location}
                          </TableCell>
                          <TableCell className="truncate max-w-[80px] md:max-w-[100px]" title={sale.salesRep}>
                            {sale.salesRep}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{sale.total}</TableCell>
                          <TableCell className="max-w-[80px] md:max-w-[100px]" title={sale.saleStatus}>
                            <Badge className="truncate w-full" variant="outline">{sale.saleStatus}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[80px] md:max-w-[100px]" title={sale.workflow}>
                            <Badge className="truncate w-full" variant="outline">{sale.workflow}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[80px] md:max-w-[100px]" title={sale.stockVerification}>
                            <Badge className="truncate w-full" variant="outline">{sale.stockVerification}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 md:gap-2">
                              <Progress value={sale.completion} className="w-[30px] sm:w-[40px] md:w-[50px]" />
                              <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                                {sale.completion}%
                              </span>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </Card>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {processedData.length} out of {salesData.length} records listed
            </p>
            <Button variant="outline" size="sm">
              Show more
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
