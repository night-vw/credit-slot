import React from 'react';
import LogoutButton from './LogoutButton';

const CreditSlotHeader: React.FC = () => {
  return (
    <header className="bg-teal-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50 flex items-center justify-between">
      {/*ログアウトボタン */}
      <LogoutButton/>
      {/* タイトル */}
      <h1 className="text-2xl md:text-4xl font-bold text-center flex-grow">収支・ざ・ろっく！</h1>
      {/* 右側に空のスペースを確保してセンタリングを保つ */}
      <div className="w-10"></div>
    </header>
  );
};

export default CreditSlotHeader;
