import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = () => {
  redirect ('/')
}

export default page