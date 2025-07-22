import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import AuthButton from "../../Shared/AuthButton/AuthButton";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../Shared/Loading/Loading";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { login, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <>
      <h3 className="text-2xl  text-secondary">
        Continue your learning journey with QuizWiz!
      </h3>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 my-3">
        <Link to="/" className="signin">
          <div className="content text-8xl xl:text-6xl lg:text-6xl py-3 rounded-lg text-center bg-stone-700 border-4 border-secondary">
            <i className="fa-solid fa-user text-secondary"></i>
            <p className="text-base mt-2">Sign in</p>
          </div>
        </Link>
        <Link to="/register" className="signup">
          <div className="content text-8xl xl:text-6xl lg:text-6xl py-3 bg-stone-700 rounded-lg text-center border-4 border-stone-700">
            <i className="fa-solid fa-user-plus  "></i>
            <p className="text-base mt-2">Sign Up</p>
          </div>
        </Link>
        <div className="signup w-1/2"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="my-12">
        <div className="email mt-2">
          <label htmlFor="email" className="w-full ps-1 mb-1 ">
            Registered email address
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

        <div className="flex mt-3 mb-16 justify-between items-end">
          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? <Loading /> : "Sign In"}
          </AuthButton>
          <p>
            Forgot password?{" "}
            <Link className="text-secondary hover:underline" to="/request-reset-password">
              click here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
