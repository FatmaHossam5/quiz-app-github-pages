import { useForm } from "react-hook-form";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import AuthButton from "../../Shared/AuthButton/AuthButton";
import useCustomFetch from "../../ApiUtils/AuthApiUtils";
import Loading from "../../Shared/Loading/Loading";
import {ResetFormInterface} from './ResetInterface.ts'

export default function RestPassword() {
  const {customFetch,loading}=useCustomFetch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  function onSubmit(data: ResetFormInterface) {
    //forget password api do not send email
    delete data.confirm_password;
    customFetch("/reset-password",data,"/");
  }
  

  return (
    <>
      <h3 className="text-2xl  text-secondry">Reset password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
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

        <div className="OTP mt-2">
          <label htmlFor="OTP" className="w-full ps-1 mb-1">
            OTP
          </label>
          <div
            className={`flex rounded-md border-3 ${
              !errors.otp ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              {...register("otp", {
                required: "otp is required",
                minLength: { value: 6, message: "otp should be 6 digits" },
                maxLength: { value: 6, message: "otp should be 6 digits" },
              })}
              type="text"
              id="OTP"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Choose your otp"
            />
            {errors.otp && (
              <ErrorMessage>{String(errors.otp.message)}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="password mt-2">
          <label htmlFor="password" className="w-full ps-1 mb-1">
            Password
          </label>
          <div
            className={`flex rounded-md border-3 ${
              !errors.password ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              {...register("password", {
                required: "field is required",
                minLength: {
                  value: 8,
                  message: "Password should be at least 8 characters",
                },
              })}
              type="password"
              id="password"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Type your password"
            />
            {errors.password && (
              <ErrorMessage>{String(errors.password.message)}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="Confirm-Password mt-2">
          <label htmlFor="Confirm-Password" className="w-full ps-1 mb-1">
            Confirm Password
          </label>
          <div
            className={`flex rounded-md border-3 ${
              !errors.confirm_password ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              {...register("confirm_password", {
                validate: (value) => {
                  return (
                    value == getValues("password") ||
                    "Confirm Password mismatch password"
                  );
                },
              })}
              type="password"
              id="Confirm-Password"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Type your confirm password"
            />
            {errors.confirm_password && (
              <ErrorMessage>{String(errors.confirm_password.message)}</ErrorMessage>
            )}
          </div>
        </div>

        <AuthButton>{loading?<Loading/>:"Reset"}</AuthButton>
      </form>
    </>
  );
}
