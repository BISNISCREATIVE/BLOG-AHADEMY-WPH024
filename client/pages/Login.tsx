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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Login Container */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#181D27] mb-2">Login</h1>
            <p className="text-sm text-[#6B7280]">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#0093DD] hover:text-[#0074B7] transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#0093DD] hover:bg-[#0074B7] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#0093DD] hover:text-[#0074B7] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile Additional Spacing */}
        <div className="h-20 md:hidden" />
      </div>
    </div>
  );
}
