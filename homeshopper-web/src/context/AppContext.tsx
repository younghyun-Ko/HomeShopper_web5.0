"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  AnalysisHistoryItem,
  Deal,
  ListingApplication,
  SearchConditions,
  ServiceUsageItem,
  User,
  VisitCartItem,
} from "@/lib/types";

// 계정별 데이터 분리: 로그인 계정마다 별도 키로 저장하고, 비회원(guest) 데이터는
// 세션이 끝나면 사라지도록 sessionStorage에만 보관한다.
const ACTIVE_ACCOUNT_KEY = "homeshopper-active-account";
const GUEST_STORAGE_KEY = "homeshopper-guest-state";
const accountStorageKey = (accountKey: string) => `homeshopper-account:${accountKey}`;

/** 이메일 로그인은 이메일로, 카카오 로그인은 별도 입력값이 없는 mock이므로 단일 데모 계정으로 구분한다 */
function getAccountKey(user: User): string {
  if (user.authMethod === "email" && user.email) {
    return `email:${user.email}`;
  }
  return "kakao:demo";
}

export interface AppState {
  wishlist: string[];
  visitCart: VisitCartItem[];
  conditions: SearchConditions | null;
  deals: Deal[];
  listingApplications: ListingApplication[];
  analysisHistory: AnalysisHistoryItem[];
  serviceUsage: ServiceUsageItem[];
  user: User;
}

const initialState: AppState = {
  wishlist: [],
  visitCart: [],
  conditions: null,
  deals: [],
  listingApplications: [],
  analysisHistory: [],
  serviceUsage: [],
  user: {
    name: "홍길동",
    phone: "010-0000-0000",
    isLoggedIn: false,
  },
};

type Action =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "RESET_TO_GUEST" }
  | { type: "TOGGLE_WISHLIST"; propertyId: string }
  | { type: "ADD_TO_VISIT_CART"; propertyId: string }
  | { type: "REMOVE_FROM_VISIT_CART"; propertyId: string }
  | { type: "SCHEDULE_VISIT"; propertyId: string; date: string; time: string }
  | { type: "MARK_VISITED"; propertyId: string }
  | { type: "SET_CONDITIONS"; conditions: SearchConditions }
  | { type: "UPSERT_DEAL"; deal: Deal }
  | { type: "ADD_LISTING_APPLICATION"; application: ListingApplication }
  | { type: "ADD_ANALYSIS_HISTORY"; item: AnalysisHistoryItem }
  | { type: "ADD_SERVICE_USAGE"; item: ServiceUsageItem }
  | { type: "SET_USER"; user: Partial<User> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      // 이전 버전에서 저장된 값에 새 필드가 없을 수 있으므로 기본값과 병합한다
      return { ...initialState, ...action.payload };

    case "RESET_TO_GUEST":
      return { ...initialState };

    case "TOGGLE_WISHLIST": {
      const exists = state.wishlist.includes(action.propertyId);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((id) => id !== action.propertyId)
          : [...state.wishlist, action.propertyId],
      };
    }

    case "ADD_TO_VISIT_CART": {
      if (state.visitCart.some((item) => item.propertyId === action.propertyId)) {
        return state;
      }
      const newItem: VisitCartItem = { propertyId: action.propertyId, visited: false };
      return { ...state, visitCart: [...state.visitCart, newItem] };
    }

    case "REMOVE_FROM_VISIT_CART":
      return {
        ...state,
        visitCart: state.visitCart.filter(
          (item) => item.propertyId !== action.propertyId,
        ),
      };

    case "SCHEDULE_VISIT":
      return {
        ...state,
        visitCart: state.visitCart.map((item) =>
          item.propertyId === action.propertyId
            ? { ...item, scheduledAt: { date: action.date, time: action.time } }
            : item,
        ),
      };

    case "MARK_VISITED":
      return {
        ...state,
        visitCart: state.visitCart.map((item) =>
          item.propertyId === action.propertyId ? { ...item, visited: true } : item,
        ),
      };

    case "SET_CONDITIONS":
      return { ...state, conditions: action.conditions };

    case "UPSERT_DEAL": {
      const exists = state.deals.some((deal) => deal.id === action.deal.id);
      return {
        ...state,
        deals: exists
          ? state.deals.map((deal) => (deal.id === action.deal.id ? action.deal : deal))
          : [...state.deals, action.deal],
      };
    }

    case "ADD_LISTING_APPLICATION":
      return {
        ...state,
        listingApplications: [...state.listingApplications, action.application],
      };

    case "ADD_ANALYSIS_HISTORY":
      return {
        ...state,
        analysisHistory: [action.item, ...state.analysisHistory],
      };

    case "ADD_SERVICE_USAGE":
      return {
        ...state,
        serviceUsage: [action.item, ...state.serviceUsage],
      };

    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.user } };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  toggleWishlist: (propertyId: string) => void;
  addToVisitCart: (propertyId: string) => void;
  removeFromVisitCart: (propertyId: string) => void;
  scheduleVisit: (propertyId: string, date: string, time: string) => void;
  markVisited: (propertyId: string) => void;
  setConditions: (conditions: SearchConditions) => void;
  upsertDeal: (deal: Deal) => void;
  addListingApplication: (application: ListingApplication) => void;
  addAnalysisHistory: (item: AnalysisHistoryItem) => void;
  addServiceUsage: (item: ServiceUsageItem) => void;
  setUser: (user: Partial<User>) => void;
  /** 로그인 완료 후 호출. 해당 계정에 저장된 이전 기록을 불러오고, 비회원 기록은 폐기한다 */
  loginAs: (user: User) => void;
  /** 계정 기록은 그대로 보존한 채 비회원 상태로 되돌린다 */
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // 마운트 이후에만 storage를 읽어 SSR과의 하이드레이션 불일치를 피한다.
  // 로그인 세션이 남아있으면 해당 계정 데이터를, 없으면 이번 브라우저 세션의
  // 비회원 기록(sessionStorage)만 불러온다.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountKey = window.localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    const raw = activeAccountKey
      ? window.localStorage.getItem(accountStorageKey(activeAccountKey))
      : window.sessionStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      try {
        const payload = JSON.parse(raw) as AppState;
        dispatch({ type: "HYDRATE", payload });
      } catch {
        // 손상된 저장값은 무시하고 기본 상태를 유지한다
      }
    }
    setHydrated(true);
  }, []);

  // hydrated 이전에 쓰면 초기 상태(빈 값)가 저장된 값을 덮어써 버린다.
  // 로그인 상태면 계정별 키에, 비회원이면 세션에만 저장해 계정 간 기록이 섞이지 않게 한다.
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    if (state.user.isLoggedIn) {
      const key = getAccountKey(state.user);
      window.localStorage.setItem(accountStorageKey(key), JSON.stringify(state));
      window.localStorage.setItem(ACTIVE_ACCOUNT_KEY, key);
    } else {
      window.sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
      window.localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
  }, [state, hydrated]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      toggleWishlist: (propertyId) => dispatch({ type: "TOGGLE_WISHLIST", propertyId }),
      addToVisitCart: (propertyId) => dispatch({ type: "ADD_TO_VISIT_CART", propertyId }),
      removeFromVisitCart: (propertyId) =>
        dispatch({ type: "REMOVE_FROM_VISIT_CART", propertyId }),
      scheduleVisit: (propertyId, date, time) =>
        dispatch({ type: "SCHEDULE_VISIT", propertyId, date, time }),
      markVisited: (propertyId) => dispatch({ type: "MARK_VISITED", propertyId }),
      setConditions: (conditions) => dispatch({ type: "SET_CONDITIONS", conditions }),
      upsertDeal: (deal) => dispatch({ type: "UPSERT_DEAL", deal }),
      addListingApplication: (application) =>
        dispatch({ type: "ADD_LISTING_APPLICATION", application }),
      addAnalysisHistory: (item) => dispatch({ type: "ADD_ANALYSIS_HISTORY", item }),
      addServiceUsage: (item) => dispatch({ type: "ADD_SERVICE_USAGE", item }),
      setUser: (user) => dispatch({ type: "SET_USER", user }),
      loginAs: (user) => {
        const key = getAccountKey(user);
        let payload: AppState = { ...initialState, user: { ...user, isLoggedIn: true } };
        if (typeof window !== "undefined") {
          const raw = window.localStorage.getItem(accountStorageKey(key));
          if (raw) {
            try {
              const stored = JSON.parse(raw) as AppState;
              payload = {
                ...initialState,
                ...stored,
                user: { ...stored.user, ...user, isLoggedIn: true },
              };
            } catch {
              // 손상된 저장값은 무시하고 새 계정처럼 시작한다
            }
          }
          // 로그인 시점의 비회원 기록은 계정에 섞이지 않도록 버린다
          window.sessionStorage.removeItem(GUEST_STORAGE_KEY);
        }
        dispatch({ type: "HYDRATE", payload });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
          window.sessionStorage.removeItem(GUEST_STORAGE_KEY);
        }
        dispatch({ type: "RESET_TO_GUEST" });
      },
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
