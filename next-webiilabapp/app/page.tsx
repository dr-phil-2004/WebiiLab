import Signup from "@/app/(auth)/sign-up/[[...sign-up]]/page";
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
    <Link href="/sign-in">
    Sign-In
    </Link>
    </div>
  )
}
