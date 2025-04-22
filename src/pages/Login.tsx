
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { LogIn } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { users, setCurrentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a login delay
    setTimeout(() => {
      // In a real app, we would validate against a backend
      // For now, just find a user with matching email
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        // In a real app, you would validate the password here
        // For demo purposes, any password works
        setCurrentUser(user);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <Card className="border-2 border-violet-100 dark:border-gray-700 shadow-xl dark:bg-gray-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center dark:text-white">
              Event Guest Management
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Enter your credentials to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="dark:text-white">Password</Label>
                  <a href="#" className="text-sm text-violet-600 hover:text-violet-800 dark:text-violet-400">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Sample Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-xs">
                  <p className="font-semibold">Manager</p>
                  <p>manager@example.com</p>
                </div>
                <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-xs">
                  <p className="font-semibold">Coordinator</p>
                  <p>coordinator@example.com</p>
                </div>
                <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-xs">
                  <p className="font-semibold">Desk</p>
                  <p>desk@example.com</p>
                </div>
                <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-xs">
                  <p className="font-semibold">Volunteer</p>
                  <p>volunteer@example.com</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
