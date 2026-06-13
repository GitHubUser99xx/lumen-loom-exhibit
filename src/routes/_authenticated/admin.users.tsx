import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listUsers, assignRole, revokeRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

const ROLES = ["visitor", "artist", "curator", "admin"] as const;

function AdminUsers() {
  const list = useServerFn(listUsers);
  const grant = useServerFn(assignRole);
  const revoke = useServerFn(revokeRole);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });

  const toggle = useMutation({
    mutationFn: ({ user_id, role, has }: { user_id: string; role: typeof ROLES[number]; has: boolean }) =>
      has ? revoke({ data: { user_id, role } }) : grant({ data: { user_id, role } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl">Users & roles</h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">User ID</th>
              {ROLES.map((r) => <th key={r} className="p-3 text-center capitalize">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u: any) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.display_name ?? "—"}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{u.id.slice(0, 8)}…</td>
                {ROLES.map((r) => {
                  const has = u.roles.includes(r);
                  return (
                    <td key={r} className="p-3 text-center">
                      <button
                        onClick={() => toggle.mutate({ user_id: u.id, role: r, has })}
                        disabled={toggle.isPending}
                        className={`rounded px-2 py-1 text-xs ${has ? "bg-primary text-primary-foreground" : "border border-border"}`}
                      >
                        {has ? "✓" : "+"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
