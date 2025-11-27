import { api } from '@/lib/axios';

export const summonerApi = {
  // 소환사 정보 검색 (닉네임#태그 형식)
  // 반환: SummonerSearchResponseDto (소환사 정보 + 랭크 정보)
  searchSummoner: async (fullName) => {
    const response = await api.get('/summoner/account', {
      params: { fullName }
    });
    return response.data;
  },

  // 소환사 최근 매치 리스트 가져오기 (puuid 필요)
  // 반환: MatchListResponseDto { matches: MatchDto[], hasMore: boolean }
  getRecentMatches: async (puuid, start = 0, count = 10) => {
    const response = await api.get('/summoner/matches', {
      params: { puuid, start, count }
    });
    return response.data;
  },

  // 단일 매치 상세 정보 가져오기 (개발/디버깅용)
  getMatch: async (puuid) => {
    const response = await api.get('/summoner/matchs', {
      params: { puuid }
    });
    return response.data;
  },

  // 소환사 리뷰 목록 가져오기 (추후 구현 예정)
  getSummonerReviews: async (summonerName, page = 0, size = 10) => {
    const response = await api.get(`/api/summoner/${summonerName}/reviews`, {
      params: { page, size }
    });
    return response.data;
  },

  // Fair Stat 정보 가져오기 (추후 구현 예정)
  getFairStats: async (summonerName) => {
    const response = await api.get(`/api/summoner/${summonerName}/fair-stats`);
    return response.data;
  }
};
