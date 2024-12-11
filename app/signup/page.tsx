"use client"
import React, { useState } from 'react';
import CreditSlotHeader from '../../components/CreditSlotHeader';
import { supabase } from "@/utils/supabaseClinet_Compoent";
import crypto from 'crypto';
import { useRouter } from 'next/navigation'; // useRouterをインポート

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // useRouterを初期化

  // アカウント作成処理
  const handleSignUp = async () => {
    // 入力検証
    if (!username || !password) {
      setErrorMessage('ユーザー名とパスワードを入力してください。');
      return;
    }

    if (username.length > 10) {
      setErrorMessage('ユーザー名は10文字以内で入力してください。');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setErrorMessage('パスワードは8文字以上16文字以内で入力してください。');
      return;
    }

    try {
      // ユーザー名の重複確認
      const { data: existingUser, error: fetchError } = await supabase
        .from('slot_credit_user')
        .select('name')
        .eq('name', username);

      if (fetchError) {
        setErrorMessage(`データベースエラー: ${fetchError.message}`);
        return;
      }

      if (existingUser && existingUser.length > 0) {
        setErrorMessage('このユーザー名は既に使用されています。');
        return;
      }

      // パスワードをSHA-256でハッシュ化
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      // Supabaseにデータを挿入
      const { error } = await supabase.from('slot_credit_user').insert([
        { name: username, password: hashedPassword },
      ]);

      if (error) {
        setErrorMessage(`アカウント作成中にエラーが発生しました: ${error.message}`);
        return;
      }

      router.push('/'); // ルートページにリダイレクト
    } catch (error) {
      setErrorMessage('予期しないエラーが発生しました。');
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <CreditSlotHeader />

      {/* アカウント作成ページのメインコンテンツ */}
      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        {/* アカウント作成フォーム */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">アカウント作成</h2>

          {/* エラーメッセージ表示 */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <form className="space-y-4">
            {/* ユーザ名を入力する項目 */}
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

            {/* パスワードを入力する項目 */}
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

          {/* ログインを促す文章とリンクを表示する */}
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
