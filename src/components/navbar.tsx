"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signInUser, signOutUser } from "@/helpers/authaction";

export function UserNav() {
  const session = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="@shadcn" />
            <AvatarFallback className="uppercase">
              {session ? session.data?.user?.email?.charAt(0) : ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session ? session.data?.user?.email?.split("@")[0] : ""}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session && session.data?.user ? session.data.user.email : ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        {session && session.data?.user ? (
          <DropdownMenuItem
            onClick={async () => {
              await signOutUser();
              await signInUser();
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>{" "}
          </DropdownMenuItem>
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
