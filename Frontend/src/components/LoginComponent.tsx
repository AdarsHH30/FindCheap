import React from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { CurrentUserAvatar } from "./current-user-avatar";

interface LoginComponentProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ user, setUser }) => {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <Popover>
        <PopoverTrigger>
          <CurrentUserAvatar className="hover:opacity-70" />
        </PopoverTrigger>
        <PopoverContent className="w-max flex flex-col items-center justify-center gap-2">
          <div className="gap-4 justify-center items-center text-sm flex">
            <Icons.google className="h-6 w-6" />
            <div className="flex flex-col">
              <p className="font-bold text-[17px]">
                {user.user_metadata.full_name}
              </p>
              <p>{user.email}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full mt-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Button className="rounded-full" onClick={handleLogin}>
        Login
      </Button>
    );
  }
};

export default LoginComponent;
