import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function NotFound() {
  const {role}=useSelector((state:any)=>state.userData.userData.profile)
  return (
    <main>
    <div className="text-center pt-28">
      <p className="text-red-900 text-5xl">404</p>
      <h2 className="mt-4 font-bold text-2xl">Page not found</h2>
      <p className="mt-4 text-muted text-lg">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="flex items-center justify-center">
       {role!=="Student"? <Link to='/dashboard' className="text-black p-2 rounded-lg bg-authImage">Go back home</Link>: <Link to='/student' className="text-black p-2 rounded-lg bg-authImage">Go back home</Link>}
      </div>
    </div>
  </main>
  )
}
