"use server";

import { prisma } from "@/lib/prisma";

export async function getUsers() {
  const users = await prisma.profile.findMany({
    include: {
      users: {
        select: {
          email: true,
        },
      },
    },
    omit: {
      user_id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  const results = users.map((user) => ({
    ...user,
    email: user.users?.email ?? null,
  }));
  return results;
}

export type User = Awaited<ReturnType<typeof getUsers>>[number];
// export type User = Awaited<ReturnType<typeof getUsers>>[];

