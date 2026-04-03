"use client";
import { User } from "@/types/user";
import { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: User;
}) {
  return (
    <UserContext.Provider value={profile}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
