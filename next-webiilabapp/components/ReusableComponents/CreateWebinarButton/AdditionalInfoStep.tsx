'use client'

import React from 'react'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Lock, MessageSquare, Percent } from 'lucide-react'

const AdditionalInfoStep = () => {
  const { formData, updateAdditionalInfoField, validation } = useWebinarStore()
  const errors = validation.additionalInfo.errors

  return (
    <div className="space-y-6 py-2">
      {/* Lock Chat Option */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 transition-all hover:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800 text-orange-500">
            {formData.additionalInfo.lockChat ? (
              <Lock className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-zinc-100">Lock Live Chat</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Disable chat for attendees by default</p>
          </div>
        </div>
        <Switch
          checked={formData.additionalInfo.lockChat || false}
          onCheckedChange={(checked) => updateAdditionalInfoField('lockChat', checked)}
        />
      </div>

      {/* Enable Coupon Option */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 transition-all hover:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800 text-orange-500">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-zinc-100">Offer Promotional Coupon</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Provide a discount code for attendees</p>
          </div>
        </div>
        <Switch
          checked={formData.additionalInfo.couponEnabled || false}
          onCheckedChange={(checked) => {
            updateAdditionalInfoField('couponEnabled', checked)
            if (!checked) {
              updateAdditionalInfoField('couponCode', '')
            }
          }}
        />
      </div>

      {/* Coupon Code Input (Shown conditionally) */}
      {formData.additionalInfo.couponEnabled && (
        <div className="space-y-2 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label htmlFor="couponCode" className="text-sm font-medium text-zinc-300">
            Coupon Code <span className="text-orange-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="couponCode"
              placeholder="e.g., WELCOME50 or SUMMERSALE"
              value={formData.additionalInfo.couponCode || ''}
              onChange={(e) => updateAdditionalInfoField('couponCode', e.target.value.toUpperCase())}
              className={`bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 transition-all uppercase ${
                errors.couponCode ? 'border-red-500/50 focus-visible:ring-red-500' : ''
              }`}
            />
          </div>
          {errors.couponCode && (
            <p className="text-xs text-red-400 font-medium">{errors.couponCode}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdditionalInfoStep
