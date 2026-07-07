import { useAuth } from "../context/AuthContext.jsx";

// Normal user dashboard / profile
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800">
        Welcome, {user.name}
      </h1>
      <p className="mt-1 text-slate-500">Here is your profile.</p>

      <div className="mt-6 max-w-md rounded-xl border border-slate-200 bg-white p-6">
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
      </div>
    </div>
  );
};

export default Dashboard;
