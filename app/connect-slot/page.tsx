"use client";
import React, { useState } from "react";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";
import { useRouter } from "next/navigation";

const ConnectSlotPage = () => {
  const [password, setPassword] = useState("");
  const router = useRouter(); // リダイレクトに利用するrouter変数

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("入力された接続コード:", password);
  };

  return (
    <>
      <CreditSlotHeader />
      <main className="overflow-hidden pt-52 md:pt-48 mt-4 flex flex-col items-center h-screen">
        <div className="text-center mb-8">
          <p className="text-lg sm:text-2xl md:text-3xl font-semibold">
            スロット機種に表示されている<br /><span className="text-rose-600">接続コード</span>を入力してください
          </p>
        </div>

        {/*接続コード入力フォーム*/}
        <form
          className="w-full max-w-md px-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="接続コードを入力"
            className="w-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
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
