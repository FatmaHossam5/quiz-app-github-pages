import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import AuthButton from "../../Shared/AuthButton/AuthButton";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../Shared/Loading/Loading";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export default function Register() {
  const { register: registerUser, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <>
      <h3 className="text-2xl text-secondry">
        Create your account and start your learning journey with QuizWiz!
      </h3>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 my-3">
        <Link to="/login" className="signin">
          <div className="content text-8xl xl:text-6xl lg:text-6xl py-3 bg-stone-700 rounded-lg text-center border-4 border-stone-700">
            <i className="fa-solid fa-user"></i>
            <p className="text-base mt-2">Sign in</p>
          </div>
        </Link>
        <Link to="/register" className="signup">
          <div className="content text-8xl xl:text-6xl lg:text-6xl py-3 rounded-lg text-center bg-stone-700 border-4 border-secondry">
            <i className="fa-solid fa-user-plus text-secondry"></i>
            <p className="text-base mt-2">Sign Up</p>
          </div>
        </Link>
        <div className="signup w-1/2"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="my-12 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="w-full ps-1 mb-1">
              First Name
            </label>
            <div className={`flex rounded-md border-3 ${!errors.first_name ? "border-white" : "border-red-500"}`}>
              <span className="flex select-none items-center me-3 pl-3 text-white">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                {...register("first_name", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
                type="text"
                id="first_name"
                className="block px-2 flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <ErrorMessage>{errors.first_name.message}</ErrorMessage>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="w-full ps-1 mb-1">
              Last Name
            </label>
            <div className={`flex rounded-md border-3 ${!errors.last_name ? "border-white" : "border-red-500"}`}>
              <span className="flex select-none items-center me-3 pl-3 text-white">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                {...register("last_name", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
                type="text"
                id="last_name"
                className="block px-2 flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <ErrorMessage>{errors.last_name.message}</ErrorMessage>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="w-full ps-1 mb-1">
            Email Address
          </label>
          <div className={`flex rounded-md border-3 ${!errors.email ? "border-white" : "border-red-500"}`}>
            <span className="flex select-none items-center me-3 pl-3 text-white">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className="block px-2 flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="w-full ps-1 mb-1">
            Password
          </label>
          <div className={`flex rounded-md border-3 ${!errors.password ? "border-white" : "border-red-500"}`}>
            <span className="flex select-none items-center me-3 pl-3 text-white">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
              type="password"
              id="password"
              className="block px-2 flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Enter your password"
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="w-full ps-1 mb-1">
            Role
          </label>
          <div className={`flex rounded-md border-3 ${!errors.role ? "border-white" : "border-red-500"}`}>
            <span className="flex select-none items-center me-3 pl-3 text-white">
              <i className="fa-solid fa-users"></i>
            </span>
            <select
              {...register("role", {
                required: "Role is required",
              })}
              id="role"
              className="block px-2 flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
            >
              <option value="" className="text-gray-900">Select your role</option>
              <option value="Student" className="text-gray-900">Student</option>
              <option value="Instructor" className="text-gray-900">Instructor</option>
            </select>
            {errors.role && (
              <ErrorMessage>{errors.role.message}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="flex mt-6 mb-16 justify-between items-center">
          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? <Loading /> : "Sign Up"}
          </AuthButton>
          <p>
            Already have an account?{" "}
            <Link className="text-secondry hover:underline" to="/login">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
