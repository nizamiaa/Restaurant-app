import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }),
      });
      if (response.ok) {
        onLogin();
      } else {
        toast.error("Yanlış şifrə");
        setPassword('');
      }
    } catch (error) {
      setError('Xəta baş verdi');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Girişi
          </h1>
          <p className="text-gray-600">İdarəetmə panelinə daxil olun</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Şifrə
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifrəsini daxil edin"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Daxil ol
          </button>
        </form>
      </div>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

