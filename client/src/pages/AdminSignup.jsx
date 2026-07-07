import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AdminSignup = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await authenticate("/auth/admin/signup", payload);
    navigate("/admin");
  };

  return (
    <AuthForm
      title="Admin sign up"
      subtitle="Create an administrator account."
      mode="signup"
      onSubmit={handleSubmit}
      footer={
        <p>
          Already an admin?{" "}
          <Link to="/admin/login" className="font-medium text-slate-800 underline">
            Log in
          </Link>
        </p>
      }
    />
  );
};

export default AdminSignup;
