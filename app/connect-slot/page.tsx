"use client";
import React, { useState } from "react";
import CreditSlotHeader from "@/components/CreditSlotHeaderLogin";

const ConnectSlotPage = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("入力されたパスワード:", password);
  };

  return (
    <>
      <CreditSlotHeader />
      <main className="overflow-hidden pt-40 md:pt-36 mt-4 flex flex-col items-center h-screen">
        <div className="text-center mb-8">
          <p className="text-lg sm:text-2xl md:text-3xl font-semibold">
            スロット機種に表示されている<br /><span className="text-rose-600">パスワード</span>を入力してください
          </p>
        </div>
        <form
          className="w-full max-w-md px-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="w-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            required
          />
          <button
            type="submit"
            className="mt-8 w-64 p-3 bg-teal-600 text-white rounded-md text-lg font-semibold hover:bg-teal-700"
          >
            送信
          </button>
          <button
            type="button"
            className="mt-10 w-64 p-3 bg-red-400 text-white rounded-md text-lg font-semibold hover:bg-red-500"
          >
            ホームに戻る
          </button>
        </form>
      </main>
    </>
  );
};

export default ConnectSlotPage;
