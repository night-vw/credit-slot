"use client";
import React, { useState } from "react";
import CreditSlotHeader from "../../components/CreditSlotHeader";
import { supabase } from "@/utils/supabaseClinet_Compoent";
import crypto from "crypto";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("ユーザー名とパスワードを入力してください。");
      return;
    }

    try {
      // パスワードをハッシュ化
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      // Supabaseからユーザーを検索
      const { data: user, error } = await supabase
        .from("slot_credit_user")
        .select("*")
        .eq("name", username)
        .eq("password", hashedPassword);

      if (error || !user || user.length === 0) {
        setErrorMessage("ユーザー名またはパスワードが間違っています。");
        return;
      }

      // ログイン成功時にトークンを保存
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      // ホームページにリダイレクト
      router.push("/");
    } catch (error) {
      setErrorMessage("予期しないエラーが発生しました。");
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <CreditSlotHeader />

      {/* ログインページのメインコンテンツ */}
      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">ログイン</h2>

          {/* エラーメッセージ表示 */}
          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

          <form className="space-y-4">
            {/* ユーザー名入力 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 hover:border-indigo-300"
                placeholder="ユーザー名を入力"
              />
            </div>

            {/* パスワード入力 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 hover:border-indigo-300"
                placeholder="パスワードを入力"
              />
            </div>

            {/* ログインボタン */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ログイン
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
