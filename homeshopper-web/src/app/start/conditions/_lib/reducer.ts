import { Dispatch } from "react";
import { DealType, PropertyType, User } from "@/lib/types";

export interface ConditionsWizardState {
  step: number;
  name: string;
  phone: string;
  propertyType: PropertyType | "";
  dealType: DealType;
  district: string;
  /** 만원 단위 숫자 문자열 */
  budget: string;
  /** 만원 단위 숫자 문자열 */
  monthlyRent: string;
  loanPlanned: boolean;
  loanMethod: string;
  areaPyeong: string;
  moveInAfter: string;
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
    district: "",
    budget: "",
    monthlyRent: "",
    loanPlanned: false,
    loanMethod: "",
    areaPyeong: "",
    moveInAfter: "",
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
  | { type: "SET_DISTRICT"; value: string }
  | { type: "SET_BUDGET"; value: string }
  | { type: "SET_MONTHLY_RENT"; value: string }
  | { type: "SET_LOAN_PLANNED"; value: boolean }
  | { type: "SET_LOAN_METHOD"; value: string }
  | { type: "SET_AREA_PYEONG"; value: string }
  | { type: "SET_MOVE_IN_AFTER"; value: string }
  | { type: "TOGGLE_PRIORITY"; value: string }
  | { type: "SET_CUSTOM_REQUEST"; value: string };

const MAX_PRIORITIES = 5;

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
    case "SET_DISTRICT":
      return { ...state, district: action.value };
    case "SET_BUDGET":
      return { ...state, budget: action.value };
    case "SET_MONTHLY_RENT":
      return { ...state, monthlyRent: action.value };
    case "SET_LOAN_PLANNED":
      return {
        ...state,
        loanPlanned: action.value,
        loanMethod: action.value ? state.loanMethod : "",
      };
    case "SET_LOAN_METHOD":
      return { ...state, loanMethod: action.value };
    case "SET_AREA_PYEONG":
      return { ...state, areaPyeong: action.value };
    case "SET_MOVE_IN_AFTER":
      return { ...state, moveInAfter: action.value };
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
