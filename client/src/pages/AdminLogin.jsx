import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLogin = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await authenticate("/auth/admin/login", payload);
    navigate("/admin");
  };

  return (
    <AuthForm
      title="Admin log in"
      subtitle="Restricted access for administrators."
      mode="login"
      onSubmit={handleSubmit}
      footer={
        <p>
          <Link to="/login" className="text-slate-500 underline">
            User login
          </Link>
        </p>
      }
    />
  );
};

export default AdminLogin;
