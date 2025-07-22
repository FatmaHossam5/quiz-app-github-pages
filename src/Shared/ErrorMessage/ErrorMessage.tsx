import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function ErrorMessage({children}: Props) {
  return (
    <>
      <div className="group">
        <i className="fa-solid fa-circle-exclamation text-red-300 p-2 "></i>

        <span className="hidden absolute group-hover:block w-auto bg-red-200 text-red-800 border border-red-500 px-2 py-1 rounded z-[1]">
          {children}
        </span>
      </div>
    </>
  );
}
