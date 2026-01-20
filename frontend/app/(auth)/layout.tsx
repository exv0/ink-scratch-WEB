// app/(auth)/layout.tsx
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange to-red items-center justify-center p-12">
        <Image
          src="/auth-illustration.svg"
          alt="Reading illustration"
          width={500}
          height={500}
          className="w-full max-w-lg"
        />
      </div>
    </div>
  );
}