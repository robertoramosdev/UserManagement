import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await authenticate("/auth/login", payload);
    navigate("/dashboard");
  };

  return (
    <AuthForm
      title="Log in"
      subtitle="Welcome back. Log in to your account."
      mode="login"
      onSubmit={handleSubmit}
      footer={
        <>
          <p>
            No account?{" "}
            <Link to="/signup" className="font-medium text-slate-800 underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/admin/login" className="text-slate-500 underline">
              Admin login
            </Link>
          </p>
        </>
      }
    />
  );
};

export default Login;
