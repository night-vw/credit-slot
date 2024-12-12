import React, { useState } from "react";
import { CgLogOut } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClinet_Compoent";

const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ログアウト処理中を管理
  const router = useRouter();

  // ログアウト処理
  const handleLogout = async () => {
    if (isLoggingOut) return; // ログアウト処理中なら再実行しない

    setIsLoggingOut(true); // ログアウト処理中に設定

    try {
      // クッキーからセッションIDを取得
      const sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)session_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      if (!sessionId) {
        console.error("セッションIDが見つかりません。");
        setIsLoggingOut(false);
        return;
      }

      // セッションIDに基づきユーザー名を取得
      const { data: sessionData, error: fetchError } = await supabase
        .from("credit_user_sessions")
        .select("username")
        .eq("session_id", sessionId)
        .single();

      if (fetchError || !sessionData) {
        console.error("セッション情報の取得エラー:", fetchError?.message || "データがありません。");
        setIsLoggingOut(false);
        return;
      }

      const username = sessionData.username;

      // ユーザー名に基づきすべてのセッションを削除
      const { error: deleteError } = await supabase
        .from("credit_user_sessions")
        .delete()
        .eq("username", username);

      if (deleteError) {
        console.error("セッション削除エラー:", deleteError.message);
        setIsLoggingOut(false);
        return;
      }

      // クッキーを削除
      document.cookie = "session_id=; path=/; max-age=0;";

      // ログアウト後にログインページへリダイレクト
      router.push("/login");
    } catch (error) {
      console.error("予期しないエラー:", error);
    } finally {
      setIsLoggingOut(false); // 処理終了後に解除
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${isLoggingOut ? "pointer-events-none opacity-50" : ""}`}
    >
      <CgLogOut
        className={`cursor-pointer text-3xl md:text-6xl ${isLoggingOut ? "text-gray-400" : "hover:text-gray-300"}`}
        aria-label="ログアウト"
        onClick={handleLogout} // クリックイベントにログアウト処理をバインド
      />
      <span className="text-[10px] md:text-sm">
        {isLoggingOut ? "ログアウト中..." : "ログアウト"}
      </span>
    </div>
  );
};

export default LogoutButton;
