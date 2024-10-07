"use server";
import { signIn, signOut } from "@/app/auth";

export const signOutUser = async () => {
  await signOut();
};

export const signInUser = async () => {
  await signIn();
};
