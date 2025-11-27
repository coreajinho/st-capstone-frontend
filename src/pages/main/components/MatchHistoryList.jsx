import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// 게임 결과에 따른 배경색
const getResultBg = (win) => {
  return win ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-red-50 border-l-4 border-l-red-500";
};

// // 게임 시간 포맷 (초 -> 분:초)
// const formatGameDuration = (seconds) => {
//   const minutes = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${minutes}분 ${secs}초`;
// };

// // 시간 경과 표시
// const formatTimeAgo = (timestamp) => {
//   const now = new Date();
//   const gameDate = new Date(timestamp);
//   const diff = (now - gameDate) / 1000 / 60; // 분 단위

//   if (diff < 60) return `${Math.floor(diff)}분 전`;
//   if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
//   if (diff < 60 * 24 * 7) return `${Math.floor(diff / 60 / 24)}일 전`;
//   return gameDate.toLocaleDateString('ko-KR');
// };

// KDA 계산
const calculateKDA = (kills, deaths, assists) => {
  if (deaths === 0) return "Perfect";
  return ((kills + assists) / deaths).toFixed(2);
};

// 소환사 주문 ID -> 이미지 파일명 매핑 (주요 스펠만)
const getSummonerSpellImage = (spellId) => {
  const spellMap = {
    1: 'SummonerBoost.png',      // 정화
    3: 'SummonerExhaust.png',    // 탈진
    4: 'SummonerFlash.png',      // 플래시
    6: 'SummonerHaste.png',      // 유체화
    7: 'SummonerHeal.png',       // 회복
    11: 'SummonerSmite.png',     // 강타
    12: 'SummonerTeleport.png',  // 순간이동
    14: 'SummonerIgnite.png',    // 점화
    21: 'SummonerBarrier.png',   // 방어막
    32: 'SummonerSnowball.png',  // 마크/대시
  };
  return spellMap[spellId] || 'SummonerFlash.png';
};

// 개별 매치 카드 컴포넌트
function MatchCard({ match, currentSummonerName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // MatchDto에서 현재 소환사의 participant 정보 찾기
  const participant = match.info?.participants?.find(
    p => p.riotIdGameName === currentSummonerName || p.summonerName === currentSummonerName
  );

  if (!participant) {
    return null; // 소환사 정보를 찾을 수 없으면 렌더링하지 않음
  }

  // participant 데이터에서 필요한 정보 추출
  const { 
    win, 
    championName, 
    teamPosition, 
    kills, 
    deaths, 
    assists,
    item0, item1, item2, item3, item4, item5, item6,
    summoner1Id, summoner2Id,
    totalMinionsKilled,
    champLevel
  } = participant;

  const kdaValue = calculateKDA(kills, deaths, assists);
  const kdaColor = kdaValue === "Perfect" || parseFloat(kdaValue) >= 3 ? "text-green-600" : 
                   parseFloat(kdaValue) >= 2 ? "text-blue-600" : "text-gray-600";

  return (
    <Card className={`${getResultBg(win)} hover:shadow-lg transition-shadow cursor-pointer`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-4">
          {/* 게임 정보 */}
          <div className="w-20 text-center">
            <div className={`font-bold text-sm ${win ? "text-blue-600" : "text-red-600"}`}>
              {win ? "승리" : "패배"}
            </div>
            <div className="text-xs text-gray-600 mt-1">랭크</div>
            <div className="text-xs text-gray-500 mt-1">
              최근 게임
            </div>
            <div className="text-xs text-gray-500">
              Lv.{champLevel}
            </div>
          </div>

          {/* 챔피언 아이콘 */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`}
                alt={championName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '';
                  e.target.style.display = 'none';
                }}
              />
            </div>
            {/* 스펠 */}
            <div className="flex gap-0.5">
              <div className="w-5 h-5 bg-gray-300 rounded">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${getSummonerSpellImage(summoner1Id)}`}
                  alt="spell1" 
                  className="w-full h-full"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div className="w-5 h-5 bg-gray-300 rounded">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${getSummonerSpellImage(summoner2Id)}`}
                  alt="spell2" 
                  className="w-full h-full"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </div>
          </div>

          {/* KDA */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {kills} / <span className="text-red-600">{deaths}</span> / {assists}
            </div>
            <div className={`text-sm font-bold ${kdaColor}`}>
              {kdaValue} KDA
            </div>
            <div className="text-xs text-gray-600 mt-1">
              CS: {totalMinionsKilled}
            </div>
            {teamPosition && (
              <div className="text-xs text-gray-600">
                {teamPosition}
              </div>
            )}
          </div>

          {/* 아이템 */}
          <div className="grid grid-cols-4 gap-1">
            {[item0, item1, item2, item3, item4, item5, item6].map((itemId, idx) => (
              <div
                key={idx}
                className="w-8 h-8 bg-gray-200 rounded border border-gray-300"
              >
                {itemId > 0 ? (
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`}
                    alt={`item${itemId}`}
                    className="w-full h-full rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>

          {/* 상세보기 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* 상세 정보 (확장 시) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="text-sm text-gray-700">
              <p>상세 게임 정보가 여기에 표시됩니다.</p>
              <p className="text-xs text-gray-500 mt-2">
                (팀 구성, CS, 골드, 딜량 등)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MatchHistoryList({ matches = [], isLoading = false, currentSummonerName = '' }) {
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        최근 게임을 불러오는 중...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        최근 게임 기록이 없습니다.
      </div>
    );
  }

  // 승/패 통계 계산
  let wins = 0;
  let losses = 0;
  matches.forEach(match => {
    const participant = match.info?.participants?.find(
      p => p.riotIdGameName === currentSummonerName || p.summonerName === currentSummonerName
    );
    if (participant) {
      if (participant.win) wins++;
      else losses++;
    }
  });
  
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">최근 게임</h2>
        <div className="text-sm text-gray-600">
          <span className="text-blue-600 font-semibold">{wins}승</span>
          {' '}
          <span className="text-red-600 font-semibold">{losses}패</span>
          {' '}
          <span className="text-gray-500">({winRate}%)</span>
        </div>
      </div>

      {matches.map((match, index) => (
        <MatchCard 
          key={index} 
          match={match} 
          currentSummonerName={currentSummonerName}
        />
      ))}
    </div>
  );
}
