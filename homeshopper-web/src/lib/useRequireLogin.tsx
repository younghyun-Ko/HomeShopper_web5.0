"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";

/**
 * 로그인이 필요한 액션(임장 신청·중개 요청 등)을 감싸는 훅.
 * 비로그인 상태면 액션을 실행하지 않고 로그인 유도 모달을 띄운다.
 */
export function useRequireLogin() {
  const router = useRouter();
  const { state } = useApp();
  const [open, setOpen] = useState(false);

  const requireLogin = (action: () => void) => {
    if (state.user.isLoggedIn) {
      action();
    } else {
      setOpen(true);
    }
  };

  const guardModal = (
    <Modal open={open} onClose={() => setOpen(false)} maxWidth="sm" title="로그인이 필요해요">
      <div className="text-center">
        <p className="text-lg font-bold text-ink">로그인이 필요해요</p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate">
          탐색은 자유롭게, 거래 추적은 로그인 후에 이어져요.
        </p>
        <div className="mt-6 flex gap-3">
          <GradientButton
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setOpen(false)}
          >
            나중에
          </GradientButton>
          <GradientButton
            type="button"
            fullWidth
            onClick={() => {
              setOpen(false);
              router.push("/login");
            }}
          >
            로그인하기
          </GradientButton>
        </div>
      </div>
    </Modal>
  );

  return { requireLogin, guardModal };
}
