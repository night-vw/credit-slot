"use client";
import React, { useState } from "react";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogout";
import { supabase } from "@/utils/supabaseClinet_Compoent";
import { useRouter } from "next/navigation";
import crypto from "crypto";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState(""); // ユーザー名の入力値を管理する変数
  const [password, setPassword] = useState(""); // パスワードの入力値を管理する変数
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージを管理する変数
  const [isLoggingIn, setIsLoggingIn] = useState(false); // ログイン処理中かどうかを管理する変数
  const router = useRouter(); // リダイレクトに利用するrouter変数

  // ログイン処理
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("ユーザー名とパスワードを入力してください。");
      return;
    }

    setIsLoggingIn(true); // ログイン処理中に設定

    try {
      // データベースからユーザーを検索
      const { data: user, error: fetchError } = await supabase
        .from("slot_credit_user")
        .select("name, password")
        .eq("name", username);

      if (fetchError) {
        setErrorMessage(`データベースエラー: ${fetchError.message}`);
        setIsLoggingIn(false); // エラー時に解除
        return;
      }

      if (!user || user.length === 0) {
        setErrorMessage("ユーザー名またはパスワードが正しくありません。");
        setIsLoggingIn(false); // エラー時に解除
        return;
      }

      // 入力されたパスワードをハッシュ化して比較
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (user[0].password !== hashedPassword) {
        setErrorMessage("ユーザー名またはパスワードが正しくありません。");
        setIsLoggingIn(false); // エラー時に解除
        return;
      }

      // セッションIDを生成
      const sessionId = crypto.randomBytes(32).toString("hex");

      // 現在の日本時間を取得
      const japanTime = new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });

      // セッションを保存
      const { error: sessionError } = await supabase
        .from("credit_user_sessions")
        .insert([{ session_id: sessionId, username: username, created_at: japanTime }]);

      if (sessionError) {
        setErrorMessage(`セッション作成エラー: ${sessionError.message}`);
        setIsLoggingIn(false); // エラー時に解除
        return;
      }

      // クッキーにセッションIDを保存
      document.cookie = `session_id=${sessionId}; path=/; max-age=604800;`;

      // ログイン成功後にリダイレクト
      router.push("/");
    } catch (error) {
      console.error("予期しないエラー:", error);
      setErrorMessage("予期しないエラーが発生しました。");
    } finally {
      setIsLoggingIn(false); // ログイン処理終了時に解除
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <CreditSlotHeader />

      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            ログイン
          </h2>

          {/* エラーメッセージ */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          {/* 入力フォーム */}
          <form className="space-y-4">
            {/* ユーザ名入力 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 hover:border-indigo-300"
                placeholder="ユーザー名を入力"
                disabled={isLoggingIn} // ログイン中は入力無効化
              />
            </div>

            {/* パスワード入力 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 hover:border-indigo-300"
                placeholder="パスワードを入力"
                disabled={isLoggingIn} // ログイン中は入力無効化
              />
            </div>

            {/* ログインボタン */}
            <button
              type="button"
              onClick={handleLogin}
              className={`w-full py-3 px-4 ${
                isLoggingIn ? "bg-teal-700" : "bg-teal-600"
              } text-white font-semibold rounded-md shadow-md ${
                isLoggingIn ? "" : "hover:bg-teal-700"
              } focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2`}
              disabled={isLoggingIn} // ログイン中はボタン無効化
            >
              {isLoggingIn ? "ログイン中..." : "ログイン"} {/* ボタンの文字列を切り替え */}
            </button>
          </form>

          {/* アカウント作成を促す文書とリンク */}
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">アカウントをお持ちでない場合は</p>
            <p>
              <a href="/signup" className="text-teal-600 hover:underline">
                アカウントを作成してください
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
