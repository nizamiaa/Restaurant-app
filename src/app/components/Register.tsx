import { useState } from "react";
import { toast } from "sonner";

export function Register({ onRegister }: { onRegister: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, language }),
      });
      if (response.ok) {
        toast.success("Registration successful");
        onRegister();
      } else {
        const data = await response.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border px-3 py-2 rounded">
        <option value="az">Azerbaijani</option>
        <option value="en">English</option>
        <option value="ru">Russian</option>
      </select>
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
