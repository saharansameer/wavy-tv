import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, Input, Label } from "@/components/ui";
import useAuthStore from "@/app/store/authStore";
import { X } from "lucide-react";
import { RenderOverlay } from "@/components";

export function AuthOverlay() {
  const { isAuthOverlayOpen, setAuthOverlayOpen } = useAuthStore();

  if (isAuthOverlayOpen)
    return (
      <RenderOverlay>
        <Tabs defaultValue="login" className="min-w-80 md:min-w-md">
          <div className="flex justify-end">
            <Button
              className="cursor-pointer max-w-10"
              variant={"secondary"}
              onClick={() => setAuthOverlayOpen(false)}
            >
              <X style={{ height: "20px", width: "20px" }} />
            </Button>
          </div>

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="login">
              Login
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="signup">
              Signup
            </TabsTrigger>
          </TabsList>

          {/* Login Card */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>Log in to get access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input type="email" id="login-email" placeholder="Email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    type="password"
                    id="login-password"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="cursor-pointer">Submit</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Signup Card */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Signup</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="johndoe@wavy.tv"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="signup-confirm-password"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="cursor-pointer">Submit</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </RenderOverlay>
    );

  return <></>;
}
