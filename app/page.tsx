"use client";
import React from "react";
import { LoginCheck } from "@/hooks/LoginCheck";
import CreditSlotHeader from "../components/CreditSlotHeaderLogin";
import LoadingComponent from "@/components/LoadingComponent";


const HomePage: React.FC = () => {

  const { username, loading } = LoginCheck();

  //ローディング中のとき
  if (loading) {
    return <LoadingComponent />; // ローディング画面表示
  }

  //ユーザ名が確定していないとき
  if (!username) {
    return null; // usernameが確定するまで保険
  }

  return (
    <>
      <CreditSlotHeader />
      <main className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            ようこそ、<span className="text-teal-600">{username}</span>さん！
          </h1>
        </div>
      </main>
    </>
  );
};

export default HomePage;
