import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Normal user dashboard / profile
const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800">
        Welcome, {user.name}
      </h1>
      <p className="mt-1 text-slate-500">Here is your profile.</p>

      <div className="mt-6 max-w-md rounded-xl border border-slate-200 bg-white p-6">
        {editing ? (
          <ProfileForm
            user={user}
            updateProfile={updateProfile}
            onDone={() => setEditing(false)}
          />
        ) : (
          <>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-slate-800">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-800">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Role</dt>
                <dd className="font-medium text-slate-800">{user.role}</dd>
              </div>
            </dl>
            <button
              onClick={() => setEditing(true)}
              className="mt-6 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Edit profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Edit form for the user's own name / email / password
const ProfileForm = ({ user, updateProfile, onDone }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send fields that have a value; skip an empty password
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      toast.success("Profile updated");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-800">Edit profile</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          name="password"
          type="password"
          minLength={6}
          placeholder="Leave blank to keep current"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default Dashboard;
