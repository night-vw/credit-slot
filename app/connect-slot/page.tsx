"use client";
import React, { useEffect, useState } from "react";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";
import LoadingComponent from "@/components/LoadingComponent";
import { LoginCheck } from "@/hooks/LoginCheck";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClinet_Compoent";

const ConnectSlotPage = () => {
  const [connct_code, setConnectCode] = useState(""); //接続コードの入力値を管理する変数
  const { username, loading } = LoginCheck(); //ログイン確認
  const router = useRouter(); // リダイレクトに利用するrouter変数
  const [shouldRenderLoading, setShouldRenderLoading] = useState(true); // 最低表示用のローディング状態

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("入力された接続コード:", connct_code);
  };

  useEffect(() => {
    if (username) {
      const fetchCredit = async () => {
        try {
          const { data, error } = await supabase
            .from("slot_credit_user")
            .select("name")
            .eq("name", username)
            .single();

          if (error) {
            console.error("Error fetching credit:", error);
          }
        } catch (err) {
          console.error("Unexpected error fetching credit:", err);
        }
      };
      fetchCredit();
    }
  }, [username]);

  //ローディング時の画面ちらつき防止処理
  useEffect(() => {
    if (!loading) {
      // ローディングが完了してから0.3秒間表示を維持
      const timeout = setTimeout(() => {
        setShouldRenderLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // ローディング中のとき
  if (loading || shouldRenderLoading) {
    return <LoadingComponent />;
  }

  // ユーザ名が確定していないとき
  if (!username) {
    return null; // usernameが確定するまで保険
  }

  // 数字のみの入力しか許可しないようにする
  const NumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 数字のみを許可し、かつ6文字以内に制限
    if (/^\d*$/.test(inputValue) && inputValue.length <= 6) {
      setConnectCode(inputValue);
    }
  };

  return (
    <>
      <CreditSlotHeader />
      <main className="overflow-hidden pt-52 md:pt-48 mt-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <p className="text-lg sm:text-2xl md:text-3xl font-semibold">
            スロット機種に表示されている<br />
            <span className="text-rose-600">接続コード</span>を入力してください
          </p>
        </div>

        {/*接続コード入力フォーム*/}
        <form
          className="w-full max-w-md px-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={connct_code}
            onChange={NumChange}
            placeholder="接続コードを入力"
            className="w-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-lg"
            inputMode="numeric" //数字キーボードを表示
            required
          />
          <button
            type="submit"
            className="mt-8 w-64 p-3 bg-teal-600 text-white rounded-md text-lg font-semibold hover:bg-teal-700"
          >
            接続
          </button>
          <button
            type="button"
            className="mt-10 w-64 p-3 bg-cyan-500 text-white rounded-md text-lg font-semibold hover:bg-cyan-600"
            onClick={() => router.push("/")}
          >
            ホームに戻る
          </button>
        </form>
      </main>
    </>
  );
};

export default ConnectSlotPage;
