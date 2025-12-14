/**
 * 티어 표시 및 변환을 위한 유틸리티 함수들
 */

// 티어 순서 정의 (낮은 순서부터)
export const TIER_ORDER = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  EMERALD: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 7,
  CHALLENGER: 7,
  MASTER_PLUS: 7,
};

// Division 순서 정의 (낮은 순서부터)
export const DIVISION_ORDER = {
  IV: 0,
  III: 1,
  II: 2,
  I: 3,
  NONE: 4, // Master 이상
  '': 4,
};

// 모든 티어-Division 조합 (슬라이더용)
export const TIER_DIVISIONS = [
  { tier: 'IRON', division: 'IV', display: 'Iron IV' },
  { tier: 'IRON', division: 'III', display: 'Iron III' },
  { tier: 'IRON', division: 'II', display: 'Iron II' },
  { tier: 'IRON', division: 'I', display: 'Iron I' },
  { tier: 'BRONZE', division: 'IV', display: 'Bronze IV' },
  { tier: 'BRONZE', division: 'III', display: 'Bronze III' },
  { tier: 'BRONZE', division: 'II', display: 'Bronze II' },
  { tier: 'BRONZE', division: 'I', display: 'Bronze I' },
  { tier: 'SILVER', division: 'IV', display: 'Silver IV' },
  { tier: 'SILVER', division: 'III', display: 'Silver III' },
  { tier: 'SILVER', division: 'II', display: 'Silver II' },
  { tier: 'SILVER', division: 'I', display: 'Silver I' },
  { tier: 'GOLD', division: 'IV', display: 'Gold IV' },
  { tier: 'GOLD', division: 'III', display: 'Gold III' },
  { tier: 'GOLD', division: 'II', display: 'Gold II' },
  { tier: 'GOLD', division: 'I', display: 'Gold I' },
  { tier: 'PLATINUM', division: 'IV', display: 'Platinum IV' },
  { tier: 'PLATINUM', division: 'III', display: 'Platinum III' },
  { tier: 'PLATINUM', division: 'II', display: 'Platinum II' },
  { tier: 'PLATINUM', division: 'I', display: 'Platinum I' },
  { tier: 'EMERALD', division: 'IV', display: 'Emerald IV' },
  { tier: 'EMERALD', division: 'III', display: 'Emerald III' },
  { tier: 'EMERALD', division: 'II', display: 'Emerald II' },
  { tier: 'EMERALD', division: 'I', display: 'Emerald I' },
  { tier: 'DIAMOND', division: 'IV', display: 'Diamond IV' },
  { tier: 'DIAMOND', division: 'III', display: 'Diamond III' },
  { tier: 'DIAMOND', division: 'II', display: 'Diamond II' },
  { tier: 'DIAMOND', division: 'I', display: 'Diamond I' },
  { tier: 'MASTER', division: '', display: 'Master' },
];

/**
 * 티어와 Division을 표시 문자열로 변환
 * @param {string} tier - 티어 (예: "GOLD")
 * @param {string} division - Division (예: "II", Master 이상은 빈 문자열)
 * @returns {string} 표시 문자열 (예: "Gold II", "Master")
 */
export function formatTierDisplay(tier, division) {
  if (!tier) return 'Unranked';
  
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  
  // Master 이상은 Division 없음
  if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER' || tier === 'MASTER_PLUS' || !division) {
    return tierName.replace('_plus', '+');
  }
  
  return `${tierName} ${division}`;
}

/**
 * TierRange 범위를 표시 문자열로 변환
 * @param {Object} minTierObj - {tier, division, lp}
 * @param {Object} maxTierObj - {tier, division, lp}
 * @returns {string} 범위 문자열 (예: "Gold IV ~ Platinum I")
 */
export function formatTierRange(minTierObj, maxTierObj) {
  if (!minTierObj || !maxTierObj) return '';
  
  const minDisplay = formatTierDisplay(minTierObj.tier, minTierObj.division);
  const maxDisplay = formatTierDisplay(maxTierObj.tier, maxTierObj.division);
  
  return `${minDisplay} ~ ${maxDisplay}`;
}

/**
 * 두 티어를 비교하여 순서 판별
 * @param {string} tier1
 * @param {string} division1
 * @param {string} tier2
 * @param {string} division2
 * @returns {number} -1: tier1 < tier2, 0: 같음, 1: tier1 > tier2
 */
export function compareTiers(tier1, division1, tier2, division2) {
  const tierOrder1 = TIER_ORDER[tier1] || 0;
  const tierOrder2 = TIER_ORDER[tier2] || 0;
  
  if (tierOrder1 !== tierOrder2) {
    return tierOrder1 - tierOrder2;
  }
  
  // 같은 티어면 Division 비교
  const divOrder1 = DIVISION_ORDER[division1] || 0;
  const divOrder2 = DIVISION_ORDER[division2] || 0;
  
  return divOrder1 - divOrder2;
}

/**
 * 티어-Division 조합을 슬라이더 인덱스로 변환
 * @param {string} tier
 * @param {string} division
 * @returns {number} 인덱스 (0부터 시작)
 */
export function tierToIndex(tier, division) {
  const index = TIER_DIVISIONS.findIndex(
    (td) => td.tier === tier && td.division === division
  );
  return index >= 0 ? index : 0;
}

/**
 * 슬라이더 인덱스를 티어-Division으로 변환
 * @param {number} index
 * @returns {Object} {tier, division}
 */
export function indexToTier(index) {
  if (index < 0 || index >= TIER_DIVISIONS.length) {
    return { tier: 'IRON', division: 'IV' };
  }
  return TIER_DIVISIONS[index];
}

/**
 * 매치 타입 표시 문자열 변환
 * @param {string} matchType
 * @returns {string}
 */
export function formatMatchType(matchType) {
  const matchTypes = {
    SOLO_RANK: '솔로랭크',
    FLEX_RANK: '자유랭크',
    OTHER_MODES: '기타 모드',
  };
  return matchTypes[matchType] || matchType;
}

/**
 * 매치 타입 아이콘 반환
 * @param {string} matchType
 * @returns {string}
 */
export function getMatchTypeIcon(matchType) {
  const icons = {
    SOLO_RANK: '🏆',
    FLEX_RANK: '🎮',
    OTHER_MODES: '⚔️',
  };
  return icons[matchType] || '📌';
}
