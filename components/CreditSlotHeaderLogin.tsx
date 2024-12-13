import React from 'react';
import LogoutButton from './LogoutButton';
import Link from 'next/link';

const CreditSlotHeader: React.FC = () => {
  return (
    <header className="bg-teal-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50 flex items-center justify-between">
      {/* ログアウトボタン */}
      <div className="flex-shrink-0">
        <LogoutButton />
      </div>
      {/* タイトル */}
      <div className="flex-grow text-center">
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-bold">
            収支・ざ・ろっく！
          </h1>
        </Link>
      </div>
      {/* 右側のスペースを調整 */}
      <div className="flex-shrink-0 w-10"></div>
    </header>
  );
};

export default CreditSlotHeader;
