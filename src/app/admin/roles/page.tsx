export default function AdminRolesPage() {
  const roles = [
    { name: "Super Admin", value: "super_admin", color: "red", permissions: "Full access to all features" },
    { name: "Admin", value: "admin", color: "purple", permissions: "Manage content, users, and settings" },
    { name: "Editor", value: "editor", color: "blue", permissions: "Manage blog posts and pages" },
    { name: "Moderator", value: "moderator", color: "green", permissions: "Moderate comments and feedback" },
    { name: "Analyst", value: "analyst", color: "orange", permissions: "View analytics and reports only" },
    { name: "Premium", value: "premium", color: "amber", permissions: "Premium user features" },
    { name: "User", value: "user", color: "slate", permissions: "Basic user features" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Role Management</h1>
        <p className="text-sm text-slate-500 mt-1">Permission-based access control</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Key</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.value} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4">
                  <span className={`inline-flex items-center gap-2 text-sm font-medium px-2.5 py-1 rounded-full bg-${role.color}-100 dark:bg-${role.color}-900/30 text-${role.color}-700`}>
                    {role.name}
                  </span>
                </td>
                <td className="p-4 text-sm font-mono text-slate-500">{role.value}</td>
                <td className="p-4 text-sm text-slate-500">{role.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
