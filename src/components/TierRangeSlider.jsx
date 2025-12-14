import { Slider } from "@/components/ui/slider";
import { formatTierDisplay, indexToTier, tierToIndex } from "@/lib/tierFormatter";
import { useEffect, useState } from "react";

/**
 * TierRange 기반 Dual Slider 컴포넌트
 * @param {Object} props
 * @param {string} props.matchType - 매치 타입 (SOLO_RANK, FLEX_RANK, OTHER_MODES)
 * @param {Object} props.minBoundary - 최소 경계 {tier, division, lp}
 * @param {Object} props.maxBoundary - 최대 경계 {tier, division, lp}
 * @param {Array} props.value - [minTierObj, maxTierObj]
 * @param {Function} props.onChange - 값 변경 콜백
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {boolean} props.requireMasterPlus - Master+ 요구 여부 (자유랭크/기타모드)
 * @param {Function} props.onMasterPlusChange - Master+ 체크박스 콜백
 */
export function TierRangeSlider({
  matchType,
  minBoundary,
  maxBoundary,
  value,
  onChange,
  disabled = false,
  requireMasterPlus = false,
  onMasterPlusChange,
}) {
  const [sliderValue, setSliderValue] = useState([0, 28]);

  // value를 인덱스로 변환
  useEffect(() => {
    if (value && value[0] && value[1]) {
      const minIdx = tierToIndex(value[0].tier, value[0].division);
      const maxIdx = tierToIndex(value[1].tier, value[1].division);
      setSliderValue([minIdx, maxIdx]);
    }
  }, [value]);

  // 슬라이더 범위 계산
  const getSliderBounds = () => {
    if (!minBoundary || !maxBoundary) {
      return { min: 0, max: 28 }; // Iron IV ~ Master
    }

    const minIdx = tierToIndex(minBoundary.tier, minBoundary.division);
    const maxIdx = tierToIndex(maxBoundary.tier, maxBoundary.division);

    return { min: minIdx, max: maxIdx };
  };

  const bounds = getSliderBounds();

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);

    const minTierData = indexToTier(newValue[0]);
    const maxTierData = indexToTier(newValue[1]);

    const minTierObj = {
      tier: minTierData.tier,
      division: minTierData.division,
      lp: 0,
    };

    const maxTierObj = {
      tier: maxTierData.tier,
      division: maxTierData.division,
      lp: 99,
    };

    onChange([minTierObj, maxTierObj]);
  };

  // 현재 선택된 티어 표시
  const getCurrentTierDisplay = () => {
    if (!value || !value[0] || !value[1]) return '';
    
    const minDisplay = formatTierDisplay(value[0].tier, value[0].division);
    const maxDisplay = formatTierDisplay(value[1].tier, value[1].division);
    
    return `${minDisplay} ~ ${maxDisplay}`;
  };

  // Master+ 체크박스 표시 여부 (자유랭크/기타모드만)
  const showMasterPlusCheckbox = matchType === 'FLEX_RANK' || matchType === 'OTHER_MODES';

  return (
    <div className="space-y-4">
      {/* Master+ 체크박스 (자유랭크/기타모드) */}
      {showMasterPlusCheckbox && onMasterPlusChange && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requireMasterPlus"
            checked={requireMasterPlus}
            onChange={(e) => onMasterPlusChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="requireMasterPlus" className="text-sm font-medium text-gray-700">
            Master+ 모집
          </label>
        </div>
      )}

      {/* 슬라이더 */}
      <div className="px-2">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          min={bounds.min}
          max={bounds.max}
          step={1}
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* 경계선 표시 */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTierDisplay(minBoundary?.tier, minBoundary?.division)}</span>
        <span>{formatTierDisplay(maxBoundary?.tier, maxBoundary?.division)}</span>
      </div>

      {/* 현재 선택 티어 표시 */}
      <div className="text-center text-sm font-semibold text-purple-700">
        {getCurrentTierDisplay()}
      </div>
    </div>
  );
}
