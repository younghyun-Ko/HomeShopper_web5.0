"use client";

import { Dispatch, useEffect } from "react";
import { getMarketBand } from "@/lib/api";
import { toMarketDealType, toMarketPropertyType } from "@/lib/mock/marketPrice";
import { ConditionsWizardState, WizardAction } from "./reducer";

/**
 * 선택된 구·매물종류·거래유형이 바뀔 때마다 시세 밴드를 조회해 reducer에 저장한다.
 * STEP2(시세 미리보기)와 STEP3(예산 슬라이더 범위)가 이 값을 함께 재사용한다.
 */
export function useMarketBand(
  state: ConditionsWizardState,
  dispatch: Dispatch<WizardAction>,
): void {
  const { districts, propertyType, dealType } = state;
  const districtsKey = districts.join(",");

  useEffect(() => {
    const bandPropertyType = toMarketPropertyType(propertyType);
    const bandDealType = toMarketDealType(dealType);

    if (districts.length === 0 || !bandPropertyType || !bandDealType) {
      dispatch({ type: "SET_MARKET_BAND", value: null });
      return;
    }

    let active = true;
    dispatch({ type: "SET_LOADING_MARKET_BAND", value: true });

    getMarketBand(districts, bandPropertyType, bandDealType).then((band) => {
      if (!active) return;
      dispatch({ type: "SET_MARKET_BAND", value: band ?? null });
      dispatch({ type: "SET_LOADING_MARKET_BAND", value: false });
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtsKey, propertyType, dealType]);
}
