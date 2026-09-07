
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';

import React from 'react'
import { toast } from 'sonner';

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    rtmp_url: string;
    streamKey: string;
}

const ObsDialogBox = ({open, onOpenChange, rtmp_url, streamKey}: Props) => {

  const copyToClipboard = async (text:string, label: string)=>{
    try {
     await navigator.clipboard.writeText(text)
     toast.success(`${label} copied to clipboard`)
    } catch (error) {
      console.error('Failed to copy Text',error )
      toast.error(`Failed to copy${label}`)
      
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
                OBS Streaming  Credentials 
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className='text-sm font-medium'>
              RTML Label

            </label>
            <div className="flex">
              <Input className="flex-1" value={rtmp_url} readOnly />
              <Button variant="outline" size="icon" className='ml-2' onClick={()=> copyToClipboard(rtmp_url, 'RTMP URL')}>
                <Copy  size={16}/>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Stream Key</label>
            <div className="flex">
              <Input value={streamKey} readOnly className="flex-1"/>
              <Button variant="outline" size="icon" className='ml-2' onClick={()=> copyToClipboard(streamKey, 'Stream Key')}>
                <Copy  size={16}/>
              </Button>

            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This is your personal stream key .Keep it sale and do not share it with anyone
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ObsDialogBox