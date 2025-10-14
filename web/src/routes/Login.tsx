import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../store/auth";

export default function Login() {
  const [email, setEmail] = useState("alice@caddy.money");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSession } = useSession();

  const api = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch(`${api}/auth/dev-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setError("Adresse non autorisée");
      return;
    }
    const body = await res.json();
    setSession(body.token, body.user);
    navigate(body.user.role === "RECIPIENT" ? "/b/home" : "/a/home", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6 rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Bienvenue sur Caddy Money</h1>
        <p className="text-sm text-gray-600">
          Version beta privée. Saisissez votre email autorisé pour recevoir un lien magique.
        </p>
        <label className="block text-sm font-medium text-gray-600">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-primary py-3 text-white font-semibold">
          Se connecter
        </button>
      </form>
    </div>
  );
}
