import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import SideBar from '../SideBar/SideBar'

export default function StudentLayout() {
  return (
    <>


    <div className=" flex">
     
      <div className="w-auto"> 
      <div className="position-sticky z-50 bg-blue-600 top-0">
        <SideBar/>
        </div>
         </div>
      <div className="w-[100%]">
      <NavBar/> 
      <Outlet/>
      </div>
    </div>
         
        </>
  )
}
