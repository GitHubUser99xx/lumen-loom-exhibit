import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMe } from "@/lib/auth.functions";

export type Me = {
  userId: string;
  email: string | null;
  displayName: string | null;
  avatarPath: string | null;
  roles: ("visitor" | "artist" | "curator" | "admin")[];
};

export function useCurrentUser() {
  const qc = useQueryClient();
  const fetchMe = useServerFn(getMe);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        qc.invalidateQueries({ queryKey: ["me"] });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  return useQuery<Me | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return (await fetchMe()) as Me;
    },
    staleTime: 30_000,
  });
}
