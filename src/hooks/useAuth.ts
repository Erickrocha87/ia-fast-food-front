"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterParams {
  email: string;
  password: string;
  restaurantName: string;
  restaurantType: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({
    email,
    password,
    restaurantName,
    restaurantType,
  }: RegisterParams) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          restaurantName,
          restaurantType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao cadastrar usuário.");
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

export function useLogin() {
  async function login({ email, password }: LoginPayload) {
    // 1) LOGIN
    const res = await fetch("http://localhost:1337/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = data?.error || "Credenciais inválidas";
      throw new Error(msg);
    }

    const token = data?.token;
    if (!token) {
      throw new Error("Erro ao autenticar: token não retornado pelo servidor.");
    }

    localStorage.setItem("token", token);

    // 2) CHECAR ASSINATURA
    try {
      const subRes = await fetch("http://localhost:1337/me/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subData = await subRes.json().catch(() => null);

      if (!subRes.ok) {
        // se der erro aqui, só consideramos como "sem assinatura"
        return { hasSubscription: false };
      }

      const hasSubscription = subData?.active === true;
      return { hasSubscription };
    } catch (err) {
      console.error("Erro ao consultar /me/subscription:", err);
      return { hasSubscription: false };
    }
  }

  return { login };
}
