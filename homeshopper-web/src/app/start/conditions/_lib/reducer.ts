import { Dispatch } from "react";
import { BuildingStructureInfo, DealType, PropertyType, User } from "@/lib/types";
import type { MergedMarketBand } from "@/lib/api";

export interface ConditionsWizardState {
  step: number;
  name: string;
  phone: string;
  propertyType: PropertyType | "";
  dealType: DealType;
  /** 최대 3개 */
  districts: string[];
  /** 보증금/매입금 예산 (만원). [0,0]은 아직 사용자가 손대지 않은 초기값 */
  budgetRange: [number, number];
  /** 희망 월세 (만원). [0,0]은 아직 사용자가 손대지 않은 초기값 */
  monthlyRentRange: [number, number];
  loanPlanned: boolean;
  loanMethod: string;
  /** 평 범위. undefined면 아직 선택 전, null이면 "잘 모르겠어요" */
  areaPyeongRange?: [number, number] | null;
  moveInAfter: string;
  /** 지금 살고 있는 집 주소 (선택) */
  currentAddress: string;
  /** 지금 집 기준으로 원하는 구조 요청사항 (선택) */
  structureRequest: string;
  /** 건축물대장 mock 조회 결과 (조회 전에는 없음) */
  currentStructure?: BuildingStructureInfo;
  isLookingUpStructure: boolean;
  /** 선택한 구·매물종류·거래유형 기준 시세 밴드. STEP2에서 조회해 STEP3의 슬라이더 범위로 재사용한다 */
  marketBand: MergedMarketBand | null;
  isLoadingMarketBand: boolean;
  /** 배열 순서 = 클릭 순서(우선순위). 최대 5개 */
  priorities: string[];
  /** 보기 항목에 없는 요청사항을 자유 텍스트로 남긴 내용 (선택) */
  customRequest: string;
}

export function createInitialState(user: User): ConditionsWizardState {
  return {
    step: 1,
    name: user.name,
    phone: user.phone,
    propertyType: "",
    dealType: "월세",
    districts: [],
    budgetRange: [0, 0],
    monthlyRentRange: [0, 0],
    loanPlanned: false,
    loanMethod: "",
    areaPyeongRange: undefined,
    moveInAfter: "",
    currentAddress: "",
    structureRequest: "",
    currentStructure: undefined,
    isLookingUpStructure: false,
    marketBand: null,
    isLoadingMarketBand: false,
    priorities: [],
    customRequest: "",
  };
}

export type WizardAction =
  | { type: "GOTO_STEP"; value: number }
  | { type: "SET_NAME"; value: string }
  | { type: "SET_PHONE"; value: string }
  | { type: "SET_PROPERTY_TYPE"; value: PropertyType }
  | { type: "SET_DEAL_TYPE"; value: DealType }
  | { type: "SET_DISTRICTS"; value: string[] }
  | { type: "SET_BUDGET_RANGE"; value: [number, number] }
  | { type: "SET_MONTHLY_RENT_RANGE"; value: [number, number] }
  | { type: "SET_LOAN_PLANNED"; value: boolean }
  | { type: "SET_LOAN_METHOD"; value: string }
  | { type: "SET_AREA_PYEONG_RANGE"; value: [number, number] | null }
  | { type: "SET_MOVE_IN_AFTER"; value: string }
  | { type: "SET_CURRENT_ADDRESS"; value: string }
  | { type: "SET_STRUCTURE_REQUEST"; value: string }
  | { type: "LOOKUP_STRUCTURE_START" }
  | { type: "LOOKUP_STRUCTURE_DONE"; value: BuildingStructureInfo }
  | { type: "SET_MARKET_BAND"; value: MergedMarketBand | null }
  | { type: "SET_LOADING_MARKET_BAND"; value: boolean }
  | { type: "TOGGLE_PRIORITY"; value: string }
  | { type: "SET_CUSTOM_REQUEST"; value: string };

const MAX_PRIORITIES = 5;
const MAX_DISTRICTS = 3;

export function reducer(
  state: ConditionsWizardState,
  action: WizardAction,
): ConditionsWizardState {
  switch (action.type) {
    case "GOTO_STEP":
      return { ...state, step: action.value };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_PHONE":
      return { ...state, phone: action.value };
    case "SET_PROPERTY_TYPE":
      return { ...state, propertyType: action.value };
    case "SET_DEAL_TYPE":
      return { ...state, dealType: action.value };
    case "SET_DISTRICTS":
      return { ...state, districts: action.value.slice(0, MAX_DISTRICTS) };
    case "SET_BUDGET_RANGE":
      return { ...state, budgetRange: action.value };
    case "SET_MONTHLY_RENT_RANGE":
      return { ...state, monthlyRentRange: action.value };
    case "SET_LOAN_PLANNED":
      return {
        ...state,
        loanPlanned: action.value,
        loanMethod: action.value ? state.loanMethod : "",
      };
    case "SET_LOAN_METHOD":
      return { ...state, loanMethod: action.value };
    case "SET_AREA_PYEONG_RANGE":
      return { ...state, areaPyeongRange: action.value };
    case "SET_MOVE_IN_AFTER":
      return { ...state, moveInAfter: action.value };
    case "SET_CURRENT_ADDRESS":
      return { ...state, currentAddress: action.value, currentStructure: undefined };
    case "SET_STRUCTURE_REQUEST":
      return { ...state, structureRequest: action.value };
    case "LOOKUP_STRUCTURE_START":
      return { ...state, isLookingUpStructure: true };
    case "LOOKUP_STRUCTURE_DONE":
      return { ...state, isLookingUpStructure: false, currentStructure: action.value };
    case "SET_MARKET_BAND":
      return { ...state, marketBand: action.value };
    case "SET_LOADING_MARKET_BAND":
      return { ...state, isLoadingMarketBand: action.value };
    case "TOGGLE_PRIORITY": {
      const exists = state.priorities.includes(action.value);
      if (exists) {
        return {
          ...state,
          priorities: state.priorities.filter((item) => item !== action.value),
        };
      }
      if (state.priorities.length >= MAX_PRIORITIES) return state;
      return { ...state, priorities: [...state.priorities, action.value] };
    }
    case "SET_CUSTOM_REQUEST":
      return { ...state, customRequest: action.value };
    default:
      return state;
  }
}

export interface StepProps {
  state: ConditionsWizardState;
  dispatch: Dispatch<WizardAction>;
}
