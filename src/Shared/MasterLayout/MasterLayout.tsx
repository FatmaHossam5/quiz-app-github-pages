import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";

export default function MasterLayout() {
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
