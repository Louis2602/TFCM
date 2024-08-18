"use client"

import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCcw, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { getContent } from "@/lib/actions/workspace/read" 
import { updateContentStatus } from "@/lib/actions/workspace/resubmit"

interface Content {
  id: string
  title: string
  status: "" | "pending" | "accepted" | "declined"
  reviewedBy: string | null
  reviewComment?: string | null 
}

export function WorkspaceCollection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  const pageSize = 50
  const currentPage = 1

  const contentOffset = pageSize * (currentPage - 1)

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await getContent(contentOffset, pageSize)
        if (res.success && res.contents) {
          setContents(res.contents)
        } else {
          toast.error("Unable to load documents: " + res.error)
        }
      } catch (err) {
        toast.error("Unable to load documents: " + err)
      } finally {
        setLoading(false)
      }
    }

    fetchContents()
  }, [contentOffset, pageSize])

  const handleResubmit = async (id: string) => {
    try {
      const res = await updateContentStatus(id)
      if (res.success) {
        toast.success("Content status updated to pending")
        // Update state to reflect the changes
        setContents((prevContents) =>
          prevContents.map((content) =>
            content.id === id ? { ...content, status: "pending" } : content
          )
        )
      } else {
        toast.error("Failed to update content status: " + res.error)
      }
    } catch (err) {
      toast.error("Error updating content status: " + err)
    }
  }

  const filteredContents = contents.filter((content) => {
    const titleMatch = content.title.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === "" || statusFilter === "all" ? true : content.status === statusFilter
    return titleMatch && statusMatch
  })

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-background p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Workspace</h1>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="search"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-10"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Reviewed By</th> {/* Column header for Reviewed By */}
              <th className="px-4 py-2 text-left min-w-[300px]">Feedback</th> {/* Larger column header */}
              <th className="px-4 py-2 text-left">Resubmit</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id} className="border-b border-muted/40 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2">{content.title}</td>
                <td className="px-4 py-2">
                  <Badge
                    variant={
                      content.status === "pending"
                        ? "outline"
                        : content.status === "declined"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {content.status}
                  </Badge>
                </td>
                <td className="px-4 py-2">{content.reviewedBy || "N/A"}</td>
                <td className="px-4 py-2 min-w-[300px]"> {/* Larger feedback field */}
                  {content.reviewComment || "No feedback"}
                </td>
                <td className="px-4 py-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleResubmit(content.id)} // Call handleResubmit on click
                  >
                    <RefreshCcw className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
