"use client"

import React, { useEffect } from "react"
import { useWebinarStore } from "@/store/useWebinarStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CreditCard,
  PhoneCall,
  Sparkles,
  AlertCircle,
  Search,
} from "lucide-react"
import { CtaTypeEnum } from "@/lib/generated/prisma/enums"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type Stripe from "stripe"

const MOCK_AGENTS = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Lead Qualification Agent (Voice & Chat)",
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Sales Closer Agent (High Ticket)",
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    name: "Product Demo & FAQ Assistant",
  },
]
type Props = {
  stripeProducts: Stripe.Product[] | []
}

const CtaStep = ({ stripeProducts }: Props) => {
  const { formData, updateCTAField, validation } = useWebinarStore()
  const { ctaLabel, tags, aiAgent, priceId, ctaType } = formData.cta
  const errors = validation.cta.errors

  // Prefill AI Agent if empty
  useEffect(() => {
    if (!formData.cta.aiAgent && MOCK_AGENTS.length > 0) {
      updateCTAField("aiAgent", MOCK_AGENTS[0].id)
    }
  }, [formData.cta.aiAgent, updateCTAField])

  // Prefill tags in cta step if empty (to bypass validation if required)
  useEffect(() => {
    if (!formData.cta.tags || formData.cta.tags.length === 0) {
      updateCTAField("tags", ["cta"])
    }
  }, [formData.cta.tags, updateCTAField])

  const selectCTA = (type: CtaTypeEnum) => {
    updateCTAField("ctaType", type)
    if (type === "BUY_NOW" && !formData.cta.ctaLabel) {
      updateCTAField("ctaLabel", "Buy Now")
    } else if (type === "BOOK_A_CALL" && !formData.cta.ctaLabel) {
      updateCTAField("ctaLabel", "Book a Call")
    }
  }
  const handleProductChange = (value: string | null) => {
    updateCTAField("priceId", value ?? "")
  }

  return (
    <div className="space-y-5 py-2">
      {/* CTA Type (Interactive Cards) */}
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-zinc-300">
          Call to Action Type <span className="text-orange-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* BOOK A CALL */}
          <div
            onClick={() => selectCTA("BOOK_A_CALL")}
            className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
              formData.cta.ctaType === "BOOK_A_CALL"
                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/5"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700/80 hover:bg-zinc-900/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  formData.cta.ctaType === "BOOK_A_CALL"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Book A Call
                </h4>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Prompt users to schedule meetings
                </p>
              </div>
            </div>
          </div>

          {/* BUY NOW */}
          <div
            onClick={() => selectCTA("BUY_NOW")}
            className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
              formData.cta.ctaType === "BUY_NOW"
                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/5"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700/80 hover:bg-zinc-900/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  formData.cta.ctaType === "BUY_NOW"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">Buy Now</h4>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Sell products or tickets directly
                </p>
              </div>
            </div>
          </div>
        </div>
        {errors.ctaType && (
          <p className="text-xs font-medium text-red-400">{errors.ctaType}</p>
        )}
      </div>

      {/* CTA Label */}
      <div className="space-y-2">
        <Label htmlFor="ctaLabel" className="text-sm font-medium text-zinc-300">
          Button Label <span className="text-orange-500">*</span>
        </Label>
        <Input
          id="ctaLabel"
          placeholder="e.g., Get Started Instantly"
          value={formData.cta.ctaLabel || ""}
          onChange={(e) => updateCTAField("ctaLabel", e.target.value)}
          className={`border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder-zinc-500 transition-all focus-visible:ring-orange-500 ${
            errors.ctaLabel
              ? "border-red-500/50 focus-visible:ring-red-500"
              : ""
          }`}
        />
        {errors.ctaLabel && (
          <p className="text-xs font-medium text-red-400">{errors.ctaLabel}</p>
        )}
      </div>

      {/* AI Agent Selection */}
      <div className="space-y-2">
        <Label
          htmlFor="aiAgent"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-300"
        >
          <Sparkles className="h-4 w-4 text-orange-500" />
          AI Conversation Agent <span className="text-orange-500">*</span>
        </Label>
        <div className="relative">
          <select
            id="aiAgent"
            value={formData.cta.aiAgent || ""}
            onChange={(e) => updateCTAField("aiAgent", e.target.value)}
            className={`w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-sm text-zinc-100 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none ${
              errors.aiAgent ? "border-red-500/50 focus:ring-red-500" : ""
            }`}
          >
            {MOCK_AGENTS.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
                className="bg-zinc-950 text-zinc-100"
              >
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        {errors.aiAgent && (
          <p className="text-xs font-medium text-red-400">{errors.aiAgent}</p>
        )}
      </div>

      {/* Price ID */}
      <div className="space-y-2">
        <Label htmlFor="priceId" className="text-sm font-medium text-zinc-300">
          Stripe Price ID <span className="text-orange-500">*</span>
        </Label>
        <Input
          id="priceId"
          placeholder="e.g., price_1Nf8Xy2eZvKYlo2C..."
          value={formData.cta.priceId || ""}
          onChange={(e) => updateCTAField("priceId", e.target.value)}
          className={`border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder-zinc-500 transition-all focus-visible:ring-orange-500 ${
            errors.priceId ? "border-red-500/50 focus-visible:ring-red-500" : ""
          }`}
        />
        {errors.priceId && (
          <p className="text-xs font-medium text-red-400">{errors.priceId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Attach an Product</Label>
        <div className="relative">
          <div className="mb-2">
            <div className="relative">
              <Search className="5 absolute top-2 left-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Agents "
                className="border border-input !bg-background/50 pl-9"
              />
            </div>
          </div>
          <Select value={priceId} onValueChange={handleProductChange}>
            <SelectTrigger className="w-full border border-input bg-background/50">
              <SelectValue placeholder="Select an  Product" />
            </SelectTrigger>

            <SelectContent className="max-h-48 border border-input bg-background">
              {stripeProducts.length > 0 ? (
                stripeProducts?.map((product) => (
                  <SelectItem
                    key={product.id}
                    value={product?.default_price?.toString() || ""}
                    className="!bg-background/50 hover:bg-white/50"
                  >
                    {product.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Create an Product in Stripe
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default CtaStep
