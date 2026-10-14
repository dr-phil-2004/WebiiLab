import React from "react"

type Props = {
  children: React.ReactNode
}

const layout = ({ children }: Props) => {
  return <div className="container mx-auto min-h-screen w-full">{children}</div>
}

export default layout
