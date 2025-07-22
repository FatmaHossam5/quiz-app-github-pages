import { ReactNode } from "react"

interface Prop{
  children:ReactNode
  type?: "submit" | "button" | "reset"
  disabled?: boolean
}

export default function AuthButton({children, type = "submit", disabled = false}:Prop) {
  return (
    <button
    type={type}
    disabled={disabled}
    className="bg-slate-50 transition duration-100 hover:bg-gray-800  text-slate-950  hover:text-slate-50  rounded-lg px-4 py-2 mt-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
    <i className="fa-solid fa-check ms-1 text-white p-1 rounded-full bg-black"></i>
  </button>
  )
}
