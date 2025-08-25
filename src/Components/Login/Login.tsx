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
    setValue,
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
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

      {/* Demo Credentials Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <i className="fa-solid fa-flask text-blue-500 mr-2"></i>
          Try Demo Accounts
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click on any account below to automatically fill the login form and explore the platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Instructor Demo Account */}
          <button
            onClick={() => fillDemoCredentials("instructor@demo.com", "12345678")}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-chalkboard-teacher text-blue-600 dark:text-blue-400"></i>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Instructor</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">instructor@demo.com</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-gray-400 text-sm"></i>
            </div>
          </button>

          {/* Student Demo Account */}
          <button
            onClick={() => fillDemoCredentials("student@demo.com", "12345678")}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user-graduate text-green-600 dark:text-green-400"></i>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Student</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">student@demo.com</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-gray-400 text-sm"></i>
            </div>
          </button>
        </div>
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
