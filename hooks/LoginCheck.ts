"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClinet_Compoent";

export const LoginCheck = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // クッキーからセッションIDを取得する関数
  const getSessionIdFromCookies = (): string | null => {
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith("session_id=")
    );
    return sessionCookie ? sessionCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const sessionId = getSessionIdFromCookies();

      if (!sessionId) {
        router.push("/login"); // セッションがない場合リダイレクト
        return;
      }

      try {
        const { data, error } = await supabase
          .from("credit_user_sessions")
          .select("username")
          .eq("session_id", sessionId)
          .single();

        if (error || !data) {
          console.error("セッション情報の取得エラー:", error?.message);
          router.push("/login"); // 無効なセッション時リダイレクト
        } else {
          setUsername(data.username); // ユーザー名を状態に設定
        }
      } catch (err) {
        console.error("予期しないエラー:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [router]);

  return { username, loading };
};
