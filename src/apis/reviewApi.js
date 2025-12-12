import { api } from '@/lib/axios';

export const reviewApi = {
  // 리뷰 작성
  createReview: async (reviewData) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },

  // 소환사 리뷰 조회 (통계 포함)
  getSummonerReviews: async (gameName, tagLine, page = 0) => {
    const response = await api.get('/api/summoner/reviews', {
      params: { gameName, tagLine, page }
    });
    return response.data;
  },

//   // 리뷰 대상자 목록 조회 (팀 게시글 기반)
//   getReviewTargets: async (postId) => {
//     const response = await api.get(`/api/reviews/targets/${postId}`);
//     return response.data;
//   },
};
