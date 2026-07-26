export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notification Center</h1>
        <p className="text-sm text-slate-500 mt-1">Push announcements to users</p>
      </div>
      <div className="glass rounded-2xl p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input type="text" className="input-field" placeholder="Announcement title..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea rows={4} className="input-field" placeholder="Notification message..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select className="input-field">
              <option value="info">Info</option>
              <option value="maintenance">Maintenance</option>
              <option value="update">Update</option>
              <option value="feature">New Feature</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Send Notification</button>
        </form>
      </div>
    </div>
  );
}
