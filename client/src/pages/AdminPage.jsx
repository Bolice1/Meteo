import { useEffect, useState } from "react";
import PageShell from "../layouts/PageShell";
import SectionCard from "../components/SectionCard";
import api from "../api/client";
import { formatDateTime, roleBadge } from "../utils/formatters";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAdminData() {
    try {
      const [usersResponse, logsResponse, statsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/logs"),
        api.get("/admin/stats")
      ]);
      setUsers(usersResponse.data.users);
      setLogs(logsResponse.data.logs);
      setStats(statsResponse.data.stats);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin data.");
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function disableUser(id) {
    try {
      await api.delete(`/admin/user/${id}`);
      setMessage("User disabled successfully.");
      loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to disable user.");
    }
  }

  async function triggerBroadcast() {
    try {
      const response = await api.post("/admin/broadcast");
      setMessage(`Broadcast complete. Sent ${response.data.result.sent} of ${response.data.result.total}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to trigger broadcast.");
    }
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <SectionCard
          title="System stats"
          subtitle="Current administrative overview"
          action={
            <button className="rounded-full bg-dawn px-4 py-2 text-sm font-medium text-ink hover:bg-amber-300" onClick={triggerBroadcast}>
              Send forecast broadcast
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Users", value: stats?.users ?? 0 },
              { label: "Active", value: stats?.activeUsers ?? 0 },
              { label: "Disabled", value: stats?.disabledUsers ?? 0 },
              { label: "Unusual logins", value: stats?.unusualLogins ?? 0 }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </SectionCard>

        <SectionCard title="Users" subtitle="Registered accounts and account status">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-white/5">
                    <td className="py-4">{user.name}</td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleBadge(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="py-4">{user.location?.city || `${user.location?.lat ?? "-"}, ${user.location?.lon ?? "-"}`}</td>
                    <td className="py-4">{user.isActive ? "Active" : "Disabled"}</td>
                    <td className="py-4">
                      <button disabled={!user.isActive} onClick={() => disableUser(user._id)} className="rounded-full border border-red-400/30 px-3 py-1 text-red-200 disabled:opacity-50">
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Login logs" subtitle="Recent authentication activity">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{log.email}</p>
                    <p className="text-sm text-slate-400">{log.device}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>{log.ip}</p>
                    <p>{formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  {log.actorType} login {log.success ? "succeeded" : "failed"}{log.unusual ? " and was marked unusual." : "."}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}

export default AdminPage;
