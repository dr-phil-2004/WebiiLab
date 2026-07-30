import PageHeader from '@/components/ReusableComponents/PageHeader'
import {  PipetteIcon, User, Webcam } from 'lucide-react'
import React from 'react'
import { PipelineIcon } from '../webinars/[webinarId]/pipeline/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { leadData } from './_tests_/data'

type Props = {}

const page = (props: Props) => {
  return (
    <><div className='w-full flex flex-col gap-8'>

      <PageHeader
        leftIcon={<Webcam className="w-3 h-3" />}
        mainIcon={<User className="w-12 h-12" />}
        rightIcon={<PipelineIcon className="w-4h-4" />}
        heading="The home to all  your Customers "
        placeholder="Search Customer..." />
    </div><Table>

      <TableHeader>
        <TableRow>
          <TableHead className='text-sm text-muted-foreground '>
            Name
          </TableHead>
          <TableHead className='text-sm text-muted-foreground '>
            Email
          </TableHead>
                    <TableHead className='text-sm text-muted-foreground '>
            Phone
          </TableHead>
                    <TableHead className='text-right text-sm text-muted-foreground '>
            Tags
          </TableHead>



        </TableRow>
      </TableHeader>
      <TableBody>
        {leadData?.map((lead, index)=>(
          <TableRow 
          key={index}
          className='border-0'
          >
            <TableCell className='font-medium'>
              {lead?.name}

            </TableCell>
            <TableCell>{lead?.email}</TableCell>
            <TableCell>{lead?.phone}</TableCell>
            <TableCell className='text-right'>{lead?.tags?.map((tag, index)=>(
             < Badge key={index} variant="outline">{tag}</Badge>
            ))}</TableCell>
            
          </TableRow>
          
        ))}
      </TableBody>

      </Table></>
  )
}

export default page