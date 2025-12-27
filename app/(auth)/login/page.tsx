// app/(auth)/login/page.tsx
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <LoginForm />
      </div>
    </div>
  );
}