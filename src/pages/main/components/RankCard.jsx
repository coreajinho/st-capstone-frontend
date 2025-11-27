import { Card, CardContent } from "@/components/ui/card";
// 티어별 이미지 import
import bronzeImg from "@/assets/images/Ranked Emblems Latest/Rank=Bronze.png";
import challengerImg from "@/assets/images/Ranked Emblems Latest/Rank=Challenger.png";
import diamondImg from "@/assets/images/Ranked Emblems Latest/Rank=Diamond.png";
import emeraldImg from "@/assets/images/Ranked Emblems Latest/Rank=Emerald.png";
import goldImg from "@/assets/images/Ranked Emblems Latest/Rank=Gold.png";
import grandmasterImg from "@/assets/images/Ranked Emblems Latest/Rank=Grandmaster.png";
import ironImg from "@/assets/images/Ranked Emblems Latest/Rank=Iron.png";
import masterImg from "@/assets/images/Ranked Emblems Latest/Rank=Master.png";
import platinumImg from "@/assets/images/Ranked Emblems Latest/Rank=Platinum.png";
import silverImg from "@/assets/images/Ranked Emblems Latest/Rank=Silver.png";

// 티어별 색상 매핑
const TIER_COLORS = {
  IRON: "text-gray-600",
  BRONZE: "text-orange-700",
  SILVER: "text-gray-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-cyan-500",
  EMERALD: "text-emerald-500",
  DIAMOND: "text-blue-400",
  MASTER: "text-purple-500",
  GRANDMASTER: "text-red-500",
  CHALLENGER: "text-yellow-300",
};


// 티어별 이미지 매핑
const TIER_IMAGES = {
  IRON: ironImg,
  BRONZE: bronzeImg,
  SILVER: silverImg,
  GOLD: goldImg,
  PLATINUM: platinumImg,
  EMERALD: emeraldImg,
  DIAMOND: diamondImg,
  MASTER: masterImg,
  GRANDMASTER: grandmasterImg,
  CHALLENGER: challengerImg,
};

const getTierImage = (tier) => {
  if (!tier) return null;
  return TIER_IMAGES[tier.toUpperCase()] || null;
};

export function RankCard({ rankData, rankType = "SOLO" }) {
  const title = rankType === "SOLO" ? "개인/2인 랭크" : "자유 랭크";

  // 랭크 데이터가 없는 경우 (Unranked)
  if (!rankData || !rankData.tier) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-6xl mb-2">🏆</div>
            <p className="text-sm">Unranked</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { tier, rank, leaguePoints, wins, losses } = rankData;
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
  const tierColor = TIER_COLORS[tier?.toUpperCase()] || "text-gray-600";
  const displayTier = tier?.toUpperCase() || "UNRANKED";
  const displayRank = rank || "";

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-1 flex flex-col">
        {/* 카드 제목(랭크모드 종류) */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

        {/* 세부 정보 */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          {/* 티어 이미지 */}
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={getTierImage(displayTier)}
              alt={`${displayTier} ${displayRank}`}
              className="w-full h-full object-contain drop-shadow-lg"
              onError={(e) => {
                // 이미지 로드 실패 시 대체 텍스트
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">🏆</div>`;
              }}
            />
          </div>

          {/* 티어 정보 */}
          <div className="flex-1 space-y-2">
            {/* 티어 및 포인트 */}
            <div>
              <h4 className={`text-xl font-bold ${tierColor}`}>
                {displayTier} {displayRank}
              </h4>
              <p className="text-sm text-gray-600">{leaguePoints} LP</p>
            </div>

            {/* 전적 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">
                  <span className="text-blue-600 font-semibold">{wins}승</span>{" "}
                  <span className="text-red-600 font-semibold">{losses}패</span>
                </span>
              </div>

              {/* 승률 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12">
                  {winRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
