import { BuildingStructureInfo } from "@/lib/types";

function hashAddress(address: string): number {
  let hash = 0;
  for (let index = 0; index < address.length; index += 1) {
    hash = (hash * 31 + address.charCodeAt(index)) >>> 0;
  }
  return hash;
}

const STRUCTURE_TYPES: BuildingStructureInfo["structureType"][] = [
  "계단식",
  "복도식",
  "타워식",
];

/**
 * 건축물대장 조회를 흉내내는 mock. 실제 공공데이터포털 API 대신 주소 문자열을
 * 해시해 같은 주소를 다시 조회해도 항상 같은 구조 정보가 나오도록 결정론적으로 만든다.
 */
export function lookupBuildingRegister(address: string): BuildingStructureInfo {
  const seed = hashAddress(address.trim());

  const builtYear = 1998 + (seed % 26); // 1998~2023
  const totalFloors = 3 + (Math.floor(seed / 7) % 13); // 3~15
  const unitFloor = 1 + (Math.floor(seed / 11) % totalFloors);
  const roomCount = 1 + (Math.floor(seed / 13) % 3); // 1~3
  const bathroomCount = 1 + (Math.floor(seed / 17) % 2); // 1~2
  const areaPyeong = 6 + (Math.floor(seed / 19) % 20); // 6~25

  return {
    builtYear,
    structureType: STRUCTURE_TYPES[seed % STRUCTURE_TYPES.length],
    totalFloors,
    unitFloor,
    roomCount,
    bathroomCount,
    areaPyeong,
    hasDressRoom: seed % 3 === 0,
    hasPantry: seed % 4 === 0,
  };
}
