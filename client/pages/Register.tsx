import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const watchedPasswordConfirmation = watch("password_confirmation");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        {/* Register Container */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#181D27] mb-2">
              Register
            </h1>
            <p className="text-sm text-[#6B7280]">
              Create your account to get started.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 md:space-y-6"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-[#374151]"
              >
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={`h-12 rounded-lg border transition-colors ${
                  errors.name
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                    : watchedName
                      ? "border-[#0093DD] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                      : "border-[#D1D5DB] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                } placeholder:text-[#9CA3AF] text-[#111827]`}
              />
              {errors.name && (
                <p className="text-sm text-[#EF4444] flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>
                  Error Text Helper
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#374151]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`h-12 rounded-lg border transition-colors ${
                  errors.email
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                    : watchedEmail
                      ? "border-[#0093DD] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                      : "border-[#D1D5DB] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                } placeholder:text-[#9CA3AF] text-[#111827]`}
              />
              {errors.email && (
                <p className="text-sm text-[#EF4444] flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>
                  Error Text Helper
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#374151]"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`h-12 pr-12 rounded-lg border transition-colors ${
                    errors.password
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                      : watchedPassword
                        ? "border-[#0093DD] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                        : "border-[#D1D5DB] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                  } placeholder:text-[#9CA3AF] text-[#111827]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6B7280]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6B7280]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-[#EF4444] flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>
                  Error Text Helper
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-medium text-[#374151]"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("password_confirmation")}
                  className={`h-12 pr-12 rounded-lg border transition-colors ${
                    errors.password_confirmation
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                      : watchedPasswordConfirmation
                        ? "border-[#0093DD] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                        : "border-[#D1D5DB] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                  } placeholder:text-[#9CA3AF] text-[#111827]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6B7280]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6B7280]" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-[#EF4444] flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>
                  Error Text Helper
                </p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#0093DD] hover:bg-[#0074B7] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 md:mt-8">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0093DD] hover:text-[#0074B7] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile Additional Spacing */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
