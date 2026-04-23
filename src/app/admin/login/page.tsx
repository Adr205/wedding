"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, Input } from "@heroui/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Ingresando...");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { message?: string };
      setStatus(data.message ?? "No se pudo iniciar sesión");
      return;
    }

    setStatus("Acceso correcto");
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <Card className="dark:border-zinc-700 dark:bg-zinc-900">
        <CardHeader className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold dark:text-zinc-100">Login administrador</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Usa tu correo y contraseña de Supabase Auth.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label="Email"
            />
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              aria-label="Contraseña"
            />

            <Button type="submit" className="w-full">
              Ingresar
            </Button>

            {status ? <p className="text-sm text-zinc-600 dark:text-zinc-300">{status}</p> : null}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
