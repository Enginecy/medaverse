"use server";

import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

export async function createAgent(data: AddUserFormData) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // throw new Error("Failed to create agent: simulated error state.");
  console.log(data);
  return {
    id: "agent-123",
    name: "New Agent",
    description: "This is a new agent created for testing purposes.",
    createdAt: new Date().toISOString(),
  };
}
