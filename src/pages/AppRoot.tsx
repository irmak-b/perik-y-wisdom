import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MobileShell } from "@/components/MobileShell";

export default function AppRoot() {
  const { user, loading } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setOnboarded(!!data?.onboarding_completed));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (onboarded === null) return null;
  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return (
    <MobileShell>
      <Outlet />
    </MobileShell>
  );
}
