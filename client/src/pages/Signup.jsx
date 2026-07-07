import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await authenticate("/auth/signup", payload);
    navigate("/dashboard");
  };

  return (
    <AuthForm
      title="Sign up"
      subtitle="Create your user account."
      mode="signup"
      onSubmit={handleSubmit}
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-800 underline">
            Log in
          </Link>
        </p>
      }
    />
  );
};

export default Signup;
