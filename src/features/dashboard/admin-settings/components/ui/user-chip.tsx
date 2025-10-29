"use client";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type UserChipProps = {
  size?: "sm" | "md" | "lg";
  user: {
    name: string;
    email?: string | null;
    avatar?: string;
  };
};
export function UserChip({ user, size = "md" }: UserChipProps) {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  const [animate, setAnimate] = useState(false);
  const prevUser = useRef(user);

  useEffect(() => {
    if (
      prevUser.current.name !== user.name ||
      prevUser.current.email !== user.email ||
      prevUser.current.avatar !== user.avatar
    ) {
      setAnimate(true);
      prevUser.current = user;
      const timeout = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  return (
    <div
      className={`flex items-center gap-2
        ${animate ? "animate-bottom-to-top" : ""}`}
    >
      <Avatar className={sizeClass[size]}>
        <Image
          src={user.avatar!}
          alt={user.name}
          fill
          className="object-cover"
        />
      </Avatar>
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-muted-foreground text-sm">{user.email}</div>
      </div>
    </div>
  );
}
