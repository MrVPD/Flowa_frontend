'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Điều hướng về trang login khi vào trang chủ
    router.replace('/auth/login');
  }, [router]);

  return null; // Không render gì cả vì sẽ được điều hướng ngay
}
