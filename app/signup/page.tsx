"use client";
import React, { useState } from "react";
import CreditSlotHeader from "../../components/CreditSlotHeader";
import { supabase } from "@/utils/supabaseClinet_Compoent";
import { useRouter } from "next/navigation";
import crypto from "crypto";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");   //ユーザ名の入力値を管理する変数
  const [password, setPassword] = useState("");   //パスワードの入力値を管理する変数
  const [errorMessage, setErrorMessage] = useState("");   //エラーメッセージを管理する変数
  const router = useRouter();   //リダイレクトに利用するrouter変数

  //アカウント作成処理
  const handleSignUp = async () => {
    if (!username || !password) {
      setErrorMessage("ユーザー名とパスワードを入力してください。");
      return;
    }

    if (username.length > 10) {
      setErrorMessage("ユーザー名は10文字以内で入力してください。");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setErrorMessage("パスワードは8文字以上16文字以内で入力してください。");
      return;
    }

    try {
      // ユーザー名の重複チェック
      const { data: existingUser, error: fetchError } = await supabase
        .from("slot_credit_user")
        .select("name")
        .eq("name", username);

      if (fetchError) {
        setErrorMessage(`データベースエラー: ${fetchError.message}`);
        return;
      }

      if (existingUser && existingUser.length > 0) {
        setErrorMessage("このユーザー名は既に使用されています。");
        return;
      }

      // パスワードのハッシュ化
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      // ユーザー登録
      const { error: insertError } = await supabase
        .from("slot_credit_user")
        .insert([{ name: username, password: hashedPassword }]);

      if (insertError) {
        setErrorMessage(
          `アカウント作成中にエラーが発生しました: ${insertError.message}`
        );
        return;
      }

      // セッションIDを生成
      const sessionId = crypto.randomBytes(32).toString("hex");

      // 現在の日本時間を取得
      const japanTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

      // セッションを保存
      const { error: sessionError } = await supabase.from("credit_user_sessions").insert([
        { session_id: sessionId, username: username,created_at:japanTime },
      ]);

      if (sessionError) {
        setErrorMessage(`セッション作成エラー: ${sessionError.message}`);
        return;
      }

      // クッキーにセッションIDを保存
      //セッションの保持を最大1週間に設定する
      document.cookie = `session_id=${sessionId}; path=/; max-age=604800;`;

      // ログイン成功後にリダイレクト
      router.push("/");
    } catch (error) {
      console.error("予期しないエラー:", error);
      setErrorMessage("予期しないエラーが発生しました。");
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <CreditSlotHeader />

      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            アカウント作成
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
              />
            </div>

            {/* アカウント作成ボタン */}
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-md shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              アカウント作成
            </button>
          </form>

          {/*ログインを促す文書とリンク */}
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              既にアカウントを持っている場合は
            </p>
            <p>
              <a href="/login" className="text-teal-600 hover:underline">
                ログインしてください
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignupPage;
