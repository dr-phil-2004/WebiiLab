'use client'

import React, { useState } from 'react'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { X, CalendarIcon, Clock, Tag, Upload, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const BasicInfoStep = () => {
  const { formData, updateBasicInfoField, validation } = useWebinarStore()
  const [tagInput, setTagInput] = useState('')
  const errors = validation.basicInfo.errors

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const cleanTag = tagInput.trim().replace(/,$/, '')
      if (cleanTag && !formData.basicInfo.tags?.includes(cleanTag)) {
        const currentTags = formData.basicInfo.tags || []
        updateBasicInfoField('tags', [...currentTags, cleanTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.basicInfo.tags || []
    updateBasicInfoField('tags', currentTags.filter(t => t !== tagToRemove))
  }

  const [calendarOpen, setCalendarOpen] = useState(false)
  const selectedDate = formData.basicInfo.date ? new Date(formData.basicInfo.date) : undefined

  return (
    <div className="space-y-5 py-2">
      {/* Webinar Name */}
      <div className="space-y-2">
        <Label htmlFor="webinarName" className="text-sm font-medium text-zinc-300">
          Webinar Name <span className="text-orange-500">*</span>
        </Label>
        <Input
          id="webinarName"
          placeholder="e.g., Master Class: AI Web Applications"
          value={formData.basicInfo.webinarName || ''}
          onChange={(e) => updateBasicInfoField('webinarName', e.target.value)}
          className={`bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 transition-all ${
            errors.webinarName ? 'border-red-500/50 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.webinarName && (
          <p className="text-xs text-red-400 font-medium">{errors.webinarName}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-zinc-300">
          Description <span className="text-orange-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Provide a detailed description of the webinar topic, agenda, and target audience..."
          value={formData.basicInfo.description || ''}
          onChange={(e) => updateBasicInfoField('description', e.target.value)}
          className={`bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 min-h-[100px] resize-none transition-all ${
            errors.description ? 'border-red-500/50 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.description && (
          <p className="text-xs text-red-400 font-medium">{errors.description}</p>
        )}
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date — Popover Calendar */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-300">
            Date <span className="text-orange-500">*</span>
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              render={
                <button
                  id="date"
                  type="button"
                  className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm h-9 transition-all
                    bg-zinc-900/60 hover:bg-zinc-900 text-left
                    ${selectedDate ? 'text-zinc-100' : 'text-zinc-500'}
                    ${errors.date
                      ? 'border-red-500/50 focus:ring-red-500 focus:ring-2'
                      : 'border-zinc-800 focus:ring-2 focus:ring-orange-500'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 shrink-0 text-zinc-500" />
                    {selectedDate
                      ? format(selectedDate, 'PPP')
                      : 'Pick a date'}
                  </span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-zinc-500" />
                </button>
              }
            />
            <PopoverContent
              className="w-auto p-0 border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl shadow-black/40"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  updateBasicInfoField('date', date ?? undefined)
                  setCalendarOpen(false)
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="[--cell-size:--spacing(8)] text-zinc-100"
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-red-400 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Time & Time Format */}
        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-medium text-zinc-300">
            Time <span className="text-orange-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="time"
                placeholder="e.g., 10:30"
                value={formData.basicInfo.time || ''}
                onChange={(e) => updateBasicInfoField('time', e.target.value)}
                className={`bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 pl-10 transition-all ${
                  errors.time ? 'border-red-500/50 focus-visible:ring-red-500' : ''
                }`}
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>

            {/* AM / PM Toggle */}
            <div className="flex bg-zinc-900/80 border border-zinc-800 rounded-lg p-0.5 overflow-hidden">
              {(['AM', 'PM'] as const).map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => updateBasicInfoField('timeFormat', format)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    (formData.basicInfo.timeFormat || 'AM') === format
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          {errors.time && (
            <p className="text-xs text-red-400 font-medium">{errors.time}</p>
          )}
        </div>
      </div>

      {/* upload a video file */}
        <div className='flex items-center gap-2'>
          <div className="flex items-center">
            <Upload  className='h-4 w-4 mr-2'/>
            Upload a video file

          </div>
          <Button 
          variant='outline'
          className='ml-auto relative  border border-input hover:bg-background hover:text-white '>

          Upload file
          <Input 
          className='absolute inset-0 opacity-0 cursor-pointer '
          type="file"
          
          />

          </Button>

        </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium text-zinc-300">
          Tags / Keywords
        </Label>
        <div className="relative">
          <Input
            id="tags"
            placeholder="Type tag and press Enter or comma"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 pl-10 transition-all"
          />
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        </div>
        
        {/* Render Badges */}
        {formData.basicInfo.tags && formData.basicInfo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.basicInfo.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 hover:bg-zinc-700 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full hover:bg-zinc-600 p-0.5 transition-colors"
                >
                  <X className="w-3 h-3 text-zinc-400" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BasicInfoStep