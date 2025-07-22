import { useForm } from "react-hook-form";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import AuthButton from "../../Shared/AuthButton/AuthButton";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  function onSubmit(data: object) {
    console.log(data);
  }

  return (
    <>
      <h3 className="text-2xl  text-secondry">Change password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
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
              !errors.password_new ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              {...register("password_new", {
                required: "new password is required",
                minLength: {
                  value: 8,
                  message: "new password should be greater than 8 digits",
                },
                validate: (value) =>
                  value == getValues("password") &&
                  "new password and old password should not match ",
              })}
              type="password"
              id="Confirm-Password"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Type your confirm password"
            />
            {errors.password_new && (
              <ErrorMessage>{String(errors.password_new.message)}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="Confirm-Password mt-2">
          <label htmlFor="Confirm-Password" className="w-full ps-1 mb-1">
            Confirm Password
          </label>
          <div
            className={`flex rounded-md border-3 ${
              !errors.confirmNewPassword ? "border-white" : "border-red-500"
            }`}
          >
            <span className="flex select-none items-center me-3 pl-3 text-white ">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              {...register("confirmNewPassword", {
                validate: (value) =>
                  value === getValues("password_new") ||
                  "passwords is mismatch",
              })}
              type="password"
              id="Confirm-Password"
              className="block px-2  flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Type your confirm password"
            />
            {errors.confirmNewPassword && (
              <ErrorMessage>
                {String(errors.confirmNewPassword.message)}
              </ErrorMessage>
            )}
          </div>
        </div>

        <AuthButton>Change</AuthButton>
      </form>
    </>
  );
}
