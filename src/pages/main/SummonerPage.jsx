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

    // 현재 사용자가 본인 계정인지 확인 (추후 인증 시스템과 연동)
    const [isOwnAccount] = useState(false); // TODO: 실제 인증 정보와 비교

    // 데이터 로딩 함수
    const loadSummonerData = async () => {
        try {
            setIsLoading(true);

            // 병렬로 데이터 로딩
            const [summonerInfo, rankInfo, fairStatsInfo, reviewsInfo, matchesInfo] = await Promise.allSettled([
                summonerApi.getSummonerInfo(decodedName),
                summonerApi.getSummonerRank(decodedName),
                summonerApi.getFairStats(decodedName),
                summonerApi.getSummonerReviews(decodedName),
                summonerApi.getMatchHistory(decodedName)
            ]);

            // 각 결과 처리
            if (summonerInfo.status === 'fulfilled') {
                setSummonerData(summonerInfo.value);
            }

            if (rankInfo.status === 'fulfilled') {
                const ranks = rankInfo.value;
                setRankData({
                    solo: ranks.find(r => r.queueType === 'RANKED_SOLO_5x5') || null,
                    flex: ranks.find(r => r.queueType === 'RANKED_FLEX_SR') || null
                });
            }

            if (fairStatsInfo.status === 'fulfilled') {
                setFairStats(fairStatsInfo.value);
            }

            if (reviewsInfo.status === 'fulfilled') {
                setReviews(reviewsInfo.value.content || reviewsInfo.value);
            }

            if (matchesInfo.status === 'fulfilled') {
                setMatches(matchesInfo.value.content || matchesInfo.value);
            }

        } catch (error) {
            console.error('소환사 데이터 로딩 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로딩
    useEffect(() => {
        loadSummonerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedName]);

    // 전적 갱신 함수
    const handleRefresh = async () => {
        try {
            await summonerApi.refreshSummonerInfo(decodedName);
            // 갱신 후 데이터 다시 로딩
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

                {/* 1-2. Fair Stat 영역 (본인 계정일 때만 표시) */}
                {isOwnAccount && (
                    <FairStatCard 
                        fairStats={fairStats} 
                        isOwnAccount={isOwnAccount}
                    />
                )}

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
                    />
                </div>
            </div>
        </div>
    );
}

export default SummonerPage;
