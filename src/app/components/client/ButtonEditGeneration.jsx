"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link"

function ButtonEditGeneration({id}) {
  const pathname = usePathname()

  return (
    <Link href={`${pathname}?edit=1`} >Modificar</Link>
  )
}

export default ButtonEditGeneration