import { AuthMethod, User } from "@/lib/types";

/**
 * 인증 어댑터. 지금은 실제 인증 없이 mock으로 동작하지만, 이 파일 내부만 교체하면
 * Supabase Auth(또는 다른 공급자)로 바꿀 수 있도록 인터페이스를 감싸 둔다.
 * 컴포넌트는 이 함수들만 호출하고, 실제 세션 상태 저장은 AppContext(useApp)가 담당한다.
 */

function delay<T>(value: T): Promise<T> {
  const ms = 300 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface SignInInput {
  method: AuthMethod;
  name?: string;
  phone?: string;
  email?: string;
}

export async function signIn(input: SignInInput): Promise<User> {
  // TODO(Supabase 교체 시): supabase.auth.signInWithOAuth / signInWithPassword 호출로 대체
  const user: User = {
    name: input.name?.trim() || "홈쇼퍼 회원",
    phone: input.phone?.trim() || "010-0000-0000",
    isLoggedIn: true,
    authMethod: input.method,
  };
  return delay(user);
}

export async function signOut(): Promise<void> {
  // TODO(Supabase 교체 시): supabase.auth.signOut() 호출로 대체
  return delay(undefined);
}

export async function getUser(): Promise<User | null> {
  // TODO(Supabase 교체 시): supabase.auth.getUser() 호출로 대체
  // mock 환경에서는 세션 확인 로직이 없고, AppContext의 localStorage가 세션 역할을 대신한다.
  return delay(null);
}
