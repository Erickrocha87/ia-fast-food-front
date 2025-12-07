"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterParams {
  email: string;
  password: string;
  restaurantName: string;
  restaurantType: string;
}

interface LoginParams {
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginParams) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login.");
      }
      console.log("CARAIO", data.token);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/planos");
    } catch (err) {
      console.error(err);
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
