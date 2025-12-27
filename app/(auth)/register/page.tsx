// app/(auth)/register/page.tsx
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <RegisterForm />
      </div>
    </div>
  );
}