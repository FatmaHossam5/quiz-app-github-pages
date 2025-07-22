import { Outlet } from "react-router-dom";
import authImage from "../../assets/a7c916596e30117cc376620019087ff8.png";

export default function AuthLayout() {
  return (
    <div className="bg-auth min-h-screen h-auto ">
      <div className="text-white container p-8">
        <div className="grid lg:grid-cols-2 sm:grid-cols-1">
          <div className="userData me-3 ">
            <h1 className="text-4xl xl:py-8 md:py-2">
              {" "}
              <i className="fa-sharp fa-solid fa-check border border-white border-3 rounded-full p-1 "></i>
              <i className="fa-solid fa-xmark border border-white border-3 rounded-full p-1 mx-1"></i>
              |Quizwiz
            </h1>
            <Outlet />
          </div>

          <div className="auth-image xl:h-height lg:h-[90vh] ms-3 bg-authImage rounded-3xl  hidden lg:block">
            <div className="h-full flex justify-center items-center">

            <img src={authImage} alt="auth-image" className="w-full p-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
