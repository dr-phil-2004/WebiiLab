"use client"

import React from "react"
import { useWebinarStore } from "@/store/useWebinarStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Lock, MessageSquare, Percent } from "lucide-react"

const AdditionalInfoStep = () => {
  const { formData, updateAdditionalInfoField, validation } = useWebinarStore()
  const errors = validation.additionalInfo.errors

  return (
    <div className="space-y-6 py-2">
      {/* Lock Chat Option */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2 text-orange-500">
            {formData.additionalInfo.lockChat ? (
              <Lock className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Lock Live Chat
            </h4>
            <p className="mt-0.5 text-xs text-zinc-400">
              Disable chat for attendees by default
            </p>
          </div>
        </div>
        <Switch
          checked={formData.additionalInfo.lockChat || false}
          onCheckedChange={(checked) =>
            updateAdditionalInfoField("lockChat", checked)
          }
        />
      </div>

      {/* Enable Coupon Option */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2 text-orange-500">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Offer Promotional Coupon
            </h4>
            <p className="mt-0.5 text-xs text-zinc-400">
              Provide a discount code for attendees
            </p>
          </div>
        </div>
        <Switch
          checked={formData.additionalInfo.couponEnabled || false}
          onCheckedChange={(checked) => {
            updateAdditionalInfoField("couponEnabled", checked)
            if (!checked) {
              updateAdditionalInfoField("couponCode", "")
            }
          }}
        />
      </div>

      {/* Coupon Code Input (Shown conditionally) */}
      {formData.additionalInfo.couponEnabled && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 duration-200">
          <Label
            htmlFor="couponCode"
            className="text-sm font-medium text-zinc-300"
          >
            Coupon Code <span className="text-orange-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="couponCode"
              placeholder="e.g., WELCOME50 or SUMMERSALE"
              value={formData.additionalInfo.couponCode || ""}
              onChange={(e) =>
                updateAdditionalInfoField(
                  "couponCode",
                  e.target.value.toUpperCase()
                )
              }
              className={`border-zinc-800 bg-zinc-950 text-zinc-100 uppercase placeholder-zinc-500 transition-all focus-visible:ring-orange-500 ${
                errors.couponCode
                  ? "border-red-500/50 focus-visible:ring-red-500"
                  : ""
              }`}
            />
          </div>
          {errors.couponCode && (
            <p className="text-xs font-medium text-red-400">
              {errors.couponCode}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdditionalInfoStep
