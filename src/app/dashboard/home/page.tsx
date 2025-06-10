import { Logout } from "@/components/logout";
import { Authenticated } from "@/lib/supabase/auth-components";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-blue-500">
      <h1>Home</h1>

      <p>Welcome {user?.email}</p>
      <Authenticated>
        <p>You are authenticated</p>
      </Authenticated>
      <Logout />
    </div>
  );
}
