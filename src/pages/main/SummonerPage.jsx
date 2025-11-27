import { summonerApi } from '@/apis/summonerApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FairStatCard } from './components/FairStatCard';
import { MatchHistoryList } from './components/MatchHistoryList';
import { ProfileCard } from './components/ProfileCard';
import { RankCard } from './components/RankCard';
import { ReviewList } from './components/ReviewList';

function SummonerPage() {
    const { summonerName } = useParams();
    const decodedName = decodeURIComponent(summonerName);

    // State 관리
    const [summonerData, setSummonerData] = useState(null);
    const [rankData, setRankData] = useState({ solo: null, flex: null });
    const [fairStats, setFairStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 검색된 소환사가 사이트에 가입된 user인지 확인
    const [hasUserAccount, setHasUserAccount] = useState(false);

    // 데이터 로딩 함수
    const loadSummonerData = async () => {
        try {
            setIsLoading(true);

            // 1. 소환사 정보 검색 (닉네임#태그)
            const summonerInfo = await summonerApi.searchSummoner(decodedName);
            
            // 소환사 기본 정보 설정
            setSummonerData({
                name: summonerInfo.nickname,
                tagLine: summonerInfo.tagline,
                puuid: summonerInfo.puuid,
                profileIconId: null, // TODO: 백엔드에서 추가 필요
                summonerLevel: null,  // TODO: 백엔드에서 추가 필요
                lastUpdated: new Date().toISOString()
            });

            // 랭크 정보 설정 (SummonerSearchResponseDto에 포함됨)
            setRankData({
                solo: summonerInfo.soloTier ? {
                    tier: summonerInfo.soloTier,
                    rank: summonerInfo.soloDivision,
                    leaguePoints: summonerInfo.soloPoints,
                    wins: summonerInfo.soloWins,
                    losses: summonerInfo.soloLoses
                } : null,
                flex: summonerInfo.flexTier ? {
                    tier: summonerInfo.flexTier,
                    rank: summonerInfo.flexDivision,
                    leaguePoints: summonerInfo.flexPoints,
                    wins: summonerInfo.flexWins,
                    losses: summonerInfo.flexLoses
                } : null
            });

            // 2. 병렬로 추가 데이터 로딩
            const [matchesResult, fairStatsResult, reviewsResult] = await Promise.allSettled([
                summonerApi.getRecentMatches(summonerInfo.puuid, 0, 10),
                summonerApi.getFairStats(decodedName),
                summonerApi.getSummonerReviews(decodedName)
            ]);

            // 매치 정보 처리
            if (matchesResult.status === 'fulfilled') {
                setMatches(matchesResult.value.matches || []);
            }

            // Fair Stat 정보 처리
            if (fairStatsResult.status === 'fulfilled' && fairStatsResult.value) {
                setFairStats(fairStatsResult.value);
                setHasUserAccount(true); // Fair Stat 정보가 있으면 가입된 사용자
            } else {
                setFairStats(null);
                setHasUserAccount(false); // Fair Stat 정보가 없으면 미가입 사용자
            }

            // 리뷰 정보 처리
            if (reviewsResult.status === 'fulfilled') {
                setReviews(reviewsResult.value.content || reviewsResult.value);
            }

        } catch (error) {
            console.error('소환사 데이터 로딩 실패:', error);
            alert('소환사 정보를 불러오는데 실패했습니다. 닉네임#태그 형식을 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로딩
    useEffect(() => {
        loadSummonerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedName]);

    // 전적 갱신 함수 (재검색으로 처리)
    const handleRefresh = async () => {
        try {
            await loadSummonerData();
        } catch (error) {
            console.error('전적 갱신 실패:', error);
            alert('전적 갱신에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">소환사 정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* 상단 영역: 4개의 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1-1. 소환사 명함 영역 */}
                <ProfileCard 
                    summonerData={summonerData} 
                    onRefresh={handleRefresh}
                />

                {/* 1-2. Fair Stat 영역 (모든 방문자에게 표시) */}
                <FairStatCard 
                    fairStats={fairStats} 
                    hasUserAccount={hasUserAccount}
                />

                {/* 1-3. 솔로랭크 영역 */}
                <RankCard 
                    rankData={rankData.solo} 
                    rankType="SOLO"
                />

                {/* 1-4. 자유랭크 영역 */}
                <RankCard 
                    rankData={rankData.flex} 
                    rankType="FLEX"
                />
            </div>

            {/* 하단 영역: 리뷰와 매치 히스토리 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2. 하단 왼쪽: 리뷰 리스트 */}
                <div>
                    <ReviewList 
                        reviews={reviews} 
                        isLoading={false}
                    />
                </div>

                {/* 3. 하단 오른쪽: 최근 게임 리스트 */}
                <div>
                    <MatchHistoryList 
                        matches={matches} 
                        isLoading={false}
                        currentSummonerName={summonerData?.name || decodedName}
                    />
                </div>
            </div>
        </div>
    );
}

export default SummonerPage;
