"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // リダイレクト用
import CreditSlotHeader from "../components/CreditSlotHeader";
import { supabase } from "@/utils/supabaseClinet_Compoent";
import LoadingComponent from "@/components/LoadingComponent";

const HomePage: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null); // ログインユーザー名
  const [loading, setLoading] = useState(true); // ローディング状態
  const router = useRouter(); // リダイレクト用

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
        router.push("/login"); // セッションがない場合にリダイレクト
        return;
      }

      try {
        // データベースからユーザー名を取得
        const { data, error } = await supabase
          .from("credit_user_sessions")
          .select("username")
          .eq("session_id", sessionId)
          .single();

        if (error || !data) {
          console.error("セッション情報の取得エラー:", error?.message);
          router.push("/login"); // 無効なセッションの場合にリダイレクト
        } else {
          setUsername(data.username); // ユーザー名を状態に設定
        }
      } catch (err) {
        console.error("予期しないエラー:", err);
        router.push("/login"); // エラー発生時もリダイレクト
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [router]);

  if (loading) {
    // ローディング画面を表示
    return <LoadingComponent />;
  }

  if (!username) {
    // usernameが確定するまでの保険
    return null;
  }

  return (
    <>
      <CreditSlotHeader />
      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            ようこそ、<span className="text-teal-600">{username}</span>さん！
          </h1>
        </div>
      </main>
    </>
  );
};

export default HomePage;
