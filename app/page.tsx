"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginCheck } from "@/hooks/LoginCheck";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";
import LoadingComponent from "@/components/LoadingComponent";
import { supabase } from "@/utils/supabaseClinet_Compoent";

const HomePage: React.FC = () => {
  const { username, loading } = LoginCheck();   //ログイン確認  
  const [credit, setCredit] = useState<number | null>(null);  //ユーザのクレジット数を管理する変数
  const [creditLoading, setCreditLoading] = useState<boolean>(true);
  const router = useRouter(); // リダイレクトに利用するrouter変数
    const [shouldRenderLoading, setShouldRenderLoading] = useState(true); // 最低表示用のローディング状態

  useEffect(() => {
    if (username) {
      const fetchCredit = async () => {
        try {
          const { data, error } = await supabase
            .from("slot_credit_user")
            .select("credit")
            .eq("name", username)
            .single();

          if (error) {
            console.error("Error fetching credit:", error);
            setCredit(null);
          } else {
            setCredit(data?.credit || 1000); // デフォルト値として0を設定
          }
        } catch (err) {
          console.error("Unexpected error fetching credit:", err);
          setCredit(null);
        } finally {
          setCreditLoading(false);
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
  if (loading || shouldRenderLoading || creditLoading) {
    return <LoadingComponent />;
  }

  // ユーザ名が確定していないとき
  if (!username) {
    return null; // usernameが確定するまで保険
  }

  return (
    <>
      <CreditSlotHeader />
      <main className="overflow-hidden pt-40 md:pt-36 mt-4">
        <div className="text-center">
          
          <h1 className="font-bold">
            <span className="text-blue-400 text-3xl sm:text-4xl md:text-5xl">
              {username}
              <span className="text-black text-xl sm:text-3xl"> さん</span>
            </span>
            <p className="mt-4 text-xl sm:text-3xl">こんにちは！</p>
          </h1>

          {/* 所持クレジットの表示 */}
          <div className="mt-8 flex justify-center">
            <p className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold">
              <span className="text-rose-600 whitespace-nowrap">所持クレジット</span>
              <br />
              <span>{credit?.toLocaleString()} 枚</span>
            </p>
          </div>

          {/* スロット機種と接続ボタンと遊戯データボタン */}
          <div className="mt-8 flex flex-col items-center space-y-4 font-bold">
            <button
              className="text-xl sm:text-2xl px-10 py-4 bg-teal-600 text-gray-100 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 whitespace-nowrap"
              onClick={() => router.push("/connect-slot")}
            >
              スロット機種と接続
            </button>
            <button
              className="text-xl sm:text-2xl px-12 py-4 bg-rose-500 text-gray-100 rounded-lg shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600 whitespace-nowrap"
              onClick={() => router.push("/game-data")}
            >
              遊戯データを確認
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
