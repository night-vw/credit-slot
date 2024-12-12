"use client";
import React, { useEffect, useState } from "react";
import { LoginCheck } from "@/hooks/LoginCheck";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";
import LoadingComponent from "@/components/LoadingComponent";
import { supabase } from "@/utils/supabaseClinet_Compoent";

const HomePage: React.FC = () => {
  const { username, loading } = LoginCheck();
  const [credit, setCredit] = useState<number | null>(null);
  const [creditLoading, setCreditLoading] = useState<boolean>(true);

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

  // ローディング中のとき
  if (loading || creditLoading) {
    return <LoadingComponent />; // ローディング画面表示
  }

  // ユーザ名が確定していないとき
  if (!username) {
    return null; // usernameが確定するまで保険
  }

  return (
    <>
      <CreditSlotHeader />
      <main className="overflow-hidden pt-40 md:pt-36 mt-4 ">
        <div className="text-center">
          <h1 className="font-bold">
            <span className="text-teal-600 text-3xl sm:text-4xl md:text-5xl">
              {username}
              <span className="text-black text-xl sm:text-3xl md:text-3xl"> さん</span>
            </span>
            <p className="mt-4 text-xl sm:text-3xl md:text-3xl">こんにちは！</p>
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
              className="text-xl sm:text-2xl px-10 py-4 bg-sky-600 text-gray-100 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700 whitespace-nowrap"
              onClick={() => console.log("スロット機種と接続ボタンがクリックされました")}
            >
              スロット機種と接続
            </button>
            <button
              className="text-xl sm:text-2xl px-12 py-4 bg-emerald-500 text-gray-100 rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 whitespace-nowrap"
              onClick={() => console.log("遊戯データボタンがクリックされました")}
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
