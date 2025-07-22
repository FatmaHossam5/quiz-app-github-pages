import { Link } from "react-router-dom";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import { useForm } from "react-hook-form";
import AuthButton from "../../Shared/AuthButton/AuthButton";
import useCustomFetch from "../../ApiUtils/AuthApiUtils";
import Loading from "../../Shared/Loading/Loading";

export default function RequsetResetPass() {
  const {customFetch,loading}=useCustomFetch();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data: object) {
    customFetch("/forgot-password",data,"/reset-password");
  }

  return (
    <>
      <h3 className="text-2xl  text-secondry">Forgot password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="my-10">
        <div className="email mt-2">
          <label htmlFor="email" className="w-full ps-1 mb-1">
            Your email address
          </label>
          <div
            className={`flex rounded-md border-3 ${
              !errors.email ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9.]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
              type="text"
              id="email"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Type your email"
            />
            {errors.email && (
              <ErrorMessage>{String(errors.email.message)}</ErrorMessage>
            )}
          </div>
        </div>

        <AuthButton>{loading?<Loading/>:"Send email"}</AuthButton>

        <div className="my-12">
          <p className="text-end">
            Login?
            <Link className="text-secondry py-24 " to="/">
              click here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
