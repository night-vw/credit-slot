"use client"
import React, { useEffect, useState } from "react";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";
import LoadingComponent from "@/components/LoadingComponent";
import { LoginCheck } from "@/hooks/LoginCheck";
import { supabase } from "@/utils/supabaseClinet_Compoent";
import { useRouter } from "next/navigation";

const page = () => {
    const { username, loading } = LoginCheck(); //ログイン確認
    const [shouldRenderLoading, setShouldRenderLoading] = useState(true); // 最低表示用のローディング状態
      const router = useRouter(); // リダイレクトに利用するrouter変数

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

    return (
        <>
            <CreditSlotHeader />
            <main className="overflow-hidden pt-40 md:pt-36 mt-4">
                <div className="text-center">
                <h1 className="font-bold">
                    <span className="text-blue-400 text-3xl sm:text-4xl md:text-5xl">
                    {username}
                    <span className="text-black text-xl sm:text-3xl md:text-3xl"> さんの</span>
                    </span>
                    <p className="mt-4 text-2xl sm:text-4xl">遊戯データ</p>
                </h1>

                    {/* スロット機種と接続ボタンと遊戯データボタン */}
                <div className="mt-8 flex flex-col items-center space-y-4 font-bold">
                    <button
                    className="text-xl sm:text-2xl px-10 py-4 bg-teal-600 text-gray-100 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 whitespace-nowrap"
                    onClick={() => router.push("/")}
                    >
                    前回の遊戯データ
                    </button>
                    <button
                    className="text-xl sm:text-2xl px-10 py-4 bg-rose-500 text-gray-100 rounded-lg shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600 whitespace-nowrap"
                    onClick={() => router.push("/")}
                    >
                    通算の遊戯データ
                    </button>
                </div>
                <button
                    className="mt-10 text-xl sm:text-2xl px-14 py-4 bg-cyan-500 text-gray-100 rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600 whitespace-nowrap"
                    onClick={() => router.push("/")}
                    >
                    ホームに戻る
                    </button>
                </div>
            </main>
        </>
    );
};

export default page;
