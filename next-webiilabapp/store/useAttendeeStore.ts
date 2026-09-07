import { Attendee } from '@/lib/generated/prisma/client'
import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AttendeeStore = {
    attendee: Attendee | null
    setAttendee: (attendee: Attendee) => void
    clearAttendee: () => void

}

const useAttendeeStore =  create<AttendeeStore>()(
        persist(
        (set)=>({

            attendee: null,
            setAttendee: (attendee) => set({ attendee }),
            clearAttendee: () => set({ attendee: null }),
        }),
        {
            name: "attendee-storage",
        }

    )

    
)

export default useAttendeeStore