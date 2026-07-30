'use client'

import React, { useEffect } from 'react'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, PhoneCall, Sparkles, AlertCircle } from 'lucide-react'
import { CtaTypeEnum } from '@/lib/generated/prisma/enums'

const MOCK_AGENTS = [
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: 'Lead Qualification Agent (Voice & Chat)' },
  { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', name: 'Sales Closer Agent (High Ticket)' },
  { id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', name: 'Product Demo & FAQ Assistant' }
]

const CtaStep = () => {
  const { formData, updateCTAField, validation } = useWebinarStore()
  const errors = validation.cta.errors

  // Prefill AI Agent if empty
  useEffect(() => {
    if (!formData.cta.aiAgent && MOCK_AGENTS.length > 0) {
      updateCTAField('aiAgent', MOCK_AGENTS[0].id)
    }
  }, [formData.cta.aiAgent, updateCTAField])

  // Prefill tags in cta step if empty (to bypass validation if required)
  useEffect(() => {
    if (!formData.cta.tags || formData.cta.tags.length === 0) {
      updateCTAField('tags', ['cta'])
    }
  }, [formData.cta.tags, updateCTAField])

  const selectCTA = (type: CtaTypeEnum) => {
    updateCTAField('ctaType', type)
    if (type === 'BUY_NOW' && !formData.cta.ctaLabel) {
      updateCTAField('ctaLabel', 'Buy Now')
    } else if (type === 'BOOK_A_CALL' && !formData.cta.ctaLabel) {
      updateCTAField('ctaLabel', 'Book a Call')
    }
  }

  return (
    <div className="space-y-5 py-2">
      {/* CTA Type (Interactive Cards) */}
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-zinc-300">
          Call to Action Type <span className="text-orange-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BOOK A CALL */}
          <div
            onClick={() => selectCTA('BOOK_A_CALL')}
            className={`cursor-pointer flex flex-col p-4 rounded-xl border transition-all ${
              formData.cta.ctaType === 'BOOK_A_CALL'
                ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/5'
                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.cta.ctaType === 'BOOK_A_CALL'
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-100">Book A Call</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Prompt users to schedule meetings</p>
              </div>
            </div>
          </div>

          {/* BUY NOW */}
          <div
            onClick={() => selectCTA('BUY_NOW')}
            className={`cursor-pointer flex flex-col p-4 rounded-xl border transition-all ${
              formData.cta.ctaType === 'BUY_NOW'
                ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/5'
                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.cta.ctaType === 'BUY_NOW'
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-100">Buy Now</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Sell products or tickets directly</p>
              </div>
            </div>
          </div>
        </div>
        {errors.ctaType && (
          <p className="text-xs text-red-400 font-medium">{errors.ctaType}</p>
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
          value={formData.cta.ctaLabel || ''}
          onChange={(e) => updateCTAField('ctaLabel', e.target.value)}
          className={`bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 transition-all ${
            errors.ctaLabel ? 'border-red-500/50 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.ctaLabel && (
          <p className="text-xs text-red-400 font-medium">{errors.ctaLabel}</p>
        )}
      </div>

      {/* AI Agent Selection */}
      <div className="space-y-2">
        <Label htmlFor="aiAgent" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500" />
          AI Conversation Agent <span className="text-orange-500">*</span>
        </Label>
        <div className="relative">
          <select
            id="aiAgent"
            value={formData.cta.aiAgent || ''}
            onChange={(e) => updateCTAField('aiAgent', e.target.value)}
            className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.aiAgent ? 'border-red-500/50 focus:ring-red-500' : ''
            }`}
          >
            {MOCK_AGENTS.map((agent) => (
              <option key={agent.id} value={agent.id} className="bg-zinc-950 text-zinc-100">
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        {errors.aiAgent && (
          <p className="text-xs text-red-400 font-medium">{errors.aiAgent}</p>
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
          value={formData.cta.priceId || ''}
          onChange={(e) => updateCTAField('priceId', e.target.value)}
          className={`bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-orange-500 transition-all ${
            errors.priceId ? 'border-red-500/50 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.priceId && (
          <p className="text-xs text-red-400 font-medium">{errors.priceId}</p>
        )}
      </div>
    </div>
  )
}

export default CtaStep
