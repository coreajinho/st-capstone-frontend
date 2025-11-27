import { axiosInstance } from '@/lib/axios';

export const summonerApi = {
  // 소환사 정보 가져오기
  getSummonerInfo: async (summonerName) => {
    const response = await axiosInstance.get(`/api/summoner/${summonerName}`);
    return response.data;
  },

  // 소환사 정보 갱신
  refreshSummonerInfo: async (summonerName) => {
    const response = await axiosInstance.post(`/api/summoner/${summonerName}/refresh`);
    return response.data;
  },

  // 소환사 랭크 정보 가져오기
  getSummonerRank: async (summonerName) => {
    const response = await axiosInstance.get(`/api/summoner/${summonerName}/rank`);
    return response.data;
  },

  // 소환사 최근 게임 목록 가져오기
  getMatchHistory: async (summonerName, page = 0, size = 20) => {
    const response = await axiosInstance.get(`/api/summoner/${summonerName}/matches`, {
      params: { page, size }
    });
    return response.data;
  },

  // 소환사 리뷰 목록 가져오기
  getSummonerReviews: async (summonerName, page = 0, size = 10) => {
    const response = await axiosInstance.get(`/api/summoner/${summonerName}/reviews`, {
      params: { page, size }
    });
    return response.data;
  },

  // Fair Stat 정보 가져오기
  getFairStats: async (summonerName) => {
    const response = await axiosInstance.get(`/api/summoner/${summonerName}/fair-stats`);
    return response.data;
  }
};
