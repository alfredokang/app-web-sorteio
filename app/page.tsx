import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";

import { ProtectedHome } from "./components/ProtectedHome";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session || !session.user?.isAuthorized) {
    redirect("/login");
  }

  return <ProtectedHome />;
}
