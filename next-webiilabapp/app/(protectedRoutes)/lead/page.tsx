import PageHeader from "@/components/ReusableComponents/PageHeader"
import { PipetteIcon, User, Webcam } from "lucide-react"
import React from "react"
import { PipelineIcon } from "../webinars/[webinarId]/pipeline/page"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { leadData } from "./_tests_/data"

const page = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <PageHeader
          leftIcon={<Webcam className="h-3 w-3" />}
          mainIcon={<User className="h-12 w-12" />}
          rightIcon={<PipelineIcon className="w-4h-4" />}
          heading="The home to all  your Customers "
          placeholder="Search Customer..."
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Phone
            </TableHead>
            <TableHead className="text-right text-sm text-muted-foreground">
              Tags
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadData?.map((lead, index) => (
            <TableRow key={index} className="border-0">
              <TableCell className="font-medium">{lead?.name}</TableCell>
              <TableCell>{lead?.email}</TableCell>
              <TableCell>{lead?.phone}</TableCell>
              <TableCell className="text-right">
                {lead?.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default page
