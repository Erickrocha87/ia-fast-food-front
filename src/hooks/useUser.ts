"use client";

import { useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export function useUser() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao buscar usuários.");
      }

      setUsers(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  const findById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao buscar usuário.");
      }

      setUser(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar usuário.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    user,
    loading,
    error,
    findAll,
    findById,
  };
}
