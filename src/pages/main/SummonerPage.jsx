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

    // 더미 데이터 확인 (coreajinho#kr1일 때만 사용)
    const isDummyAccount = decodedName === 'coreajinho#kr1';

    // 데이터 로딩 함수
    const loadSummonerData = async () => {
        try {
            setIsLoading(true);

            // coreajinho#kr1인 경우 더미 데이터 사용
            if (isDummyAccount) {
                setSummonerData({
                    name: 'coreajinho',
                    tagLine: 'kr1',
                    puuid: 'dummy-puuid-12345',
                    profileIconId: 4568,
                    summonerLevel: 157,
                    lastUpdated: new Date().toISOString()
                });

                setRankData({
                    solo: {
                        tier: 'PLATINUM',
                        rank: 'II',
                        leaguePoints: 45,
                        wins: 128,
                        losses: 115
                    },
                    flex: {
                        tier: 'GOLD',
                        rank: 'I',
                        leaguePoints: 78,
                        wins: 52,
                        losses: 48
                    }
                });

                setFairStats({
                    totalJudgments: 45,
                    wonJudgments: 28,
                    skillRating: 4.2,
                    teamworkRating: 4.5,
                    mentalRating: 3.8,
                    mannerRating: 4.7,
                    totalReviews: 32
                });

                setHasUserAccount(true);

                setReviews([
                    {
                        id: 1,
                        reviewer: '슈퍼탑라이너',
                        date: '2025-11-25',
                        skillRating: 4,
                        teamworkRating: 5,
                        mentalRating: 4,
                        mannerRating: 5,
                        comment: '정말 좋은 실력의 정글러였습니다. 갱킹 타이밍도 완벽했어요!'
                    },
                    {
                        id: 2,
                        reviewer: '미드장인',
                        date: '2025-11-23',
                        skillRating: 4,
                        teamworkRating: 4,
                        mentalRating: 3,
                        mannerRating: 4,
                        comment: '팀플레이가 좋았고 소통도 원활했습니다.'
                    },
                    {
                        id: 3,
                        reviewer: '원딜러123',
                        date: '2025-11-20',
                        skillRating: 5,
                        teamworkRating: 5,
                        mentalRating: 4,
                        mannerRating: 5,
                        comment: '캐리력이 대단하시네요! 다음에 또 같이 하고 싶습니다.'
                    }
                ]);

                setMatches([
                    {
                        matchId: 'dummy-match-1',
                        gameCreation: Date.now() - 3600000,
                        gameDuration: 1847,
                        gameMode: 'CLASSIC',
                        win: true,
                        championName: 'LeeSin',
                        kills: 8,
                        deaths: 3,
                        assists: 12,
                        totalDamageDealt: 156789,
                        goldEarned: 14532,
                        visionScore: 45
                    },
                    {
                        matchId: 'dummy-match-2',
                        gameCreation: Date.now() - 7200000,
                        gameDuration: 2156,
                        gameMode: 'CLASSIC',
                        win: false,
                        championName: 'Graves',
                        kills: 5,
                        deaths: 7,
                        assists: 8,
                        totalDamageDealt: 142356,
                        goldEarned: 12845,
                        visionScore: 38
                    },
                    {
                        matchId: 'dummy-match-3',
                        gameCreation: Date.now() - 10800000,
                        gameDuration: 1654,
                        gameMode: 'CLASSIC',
                        win: true,
                        championName: 'Jarvan IV',
                        kills: 6,
                        deaths: 2,
                        assists: 15,
                        totalDamageDealt: 128945,
                        goldEarned: 13678,
                        visionScore: 52
                    }
                ]);

                setIsLoading(false);
                return;
            }

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
