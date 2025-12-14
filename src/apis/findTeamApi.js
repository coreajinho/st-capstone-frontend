import { api } from "@/lib/axios";

export const findTeamApi = {
  // ---------------------------------------------------------------
  // 게시글 기능
  // ---------------------------------------------------------------

  // 게시글 목록 조회(기본값: 활성상태 게시글만)
  getPosts: async () => {
    const response = await api.get('/api/find-team/posts/active');
    return response.data;
  },

  // 내 게시글 목록 조회
  getMyPosts: async () => {
    const response = await api.get('/api/find-team/posts/my-posts');
    return response.data;
  },

  // 게시글 검색
  searchPosts: async (searchType, keyword) => {
    const response = await api.get('/api/find-team/posts/search', {
      params: {
        searchType,
        keyword
      }
    });
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (id) => {
    const response = await api.get(`/api/find-team/posts/${id}`);
    return response.data;
  },

  // 요청(댓글) 목록 조회
  getRequests: async (id) => {
    const response = await api.get(`/api/find-team/posts/${id}/requests`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (postData) => {
    const response = await api.post('/api/find-team/posts', postData);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    const response = await api.put(`/api/find-team/posts/${id}`, postData);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (id) => {
    await api.delete(`/api/find-team/posts/${id}`);
  },

  // ---------------------------------------------------------------
  // 요청(댓글) 기능
  // ---------------------------------------------------------------

  // 요청 작성
  createRequest: async (postId, requestData) => {
    const response = await api.post(`/api/find-team/posts/${postId}/requests`, requestData);
    return response.data;
  },

  // 요청 수정
  updateRequest: async (postId, requestId, requestData) => {
    const response = await api.put(`/api/find-team/posts/${postId}/requests/${requestId}`, requestData);
    return response.data;
  },

  // 요청 삭제
  deleteRequest: async (postId, requestId) => {
    await api.delete(`/api/find-team/posts/${postId}/requests/${requestId}`);
  },

  // 요청 수락 토글
  toggleAcceptance: async (postId, requestId) => {
    const response = await api.post(`/api/find-team/posts/${postId}/requests/${requestId}/toggle-accept`);
    return response.data;
  },

  // ---------------------------------------------------------------
  // 내 요청 기능
  // ---------------------------------------------------------------

  // 내 모든 요청 조회
  getMyRequests: async () => {
    const response = await api.get('/api/find-team/requests/my-requests');
    return response.data;
  },

  // 내 수락된 요청 조회
  getMyAcceptedRequests: async () => {
    const response = await api.get('/api/find-team/requests/my-requests/accepted');
    return response.data;
  },

  // 내 수락되지 않은 요청 조회
  getMyPendingRequests: async () => {
    const response = await api.get('/api/find-team/requests/my-requests/pending');
    return response.data;
  },

  // ---------------------------------------------------------------
  // 티어 관련 기능 (TierRange 기반)
  // ---------------------------------------------------------------

  // 작성자 티어 정보 조회 (WriterTierInfoResponse)
  getWriterTierInfo: async (userId) => {
    const response = await api.get(`/api/find-team/posts/writer-tier-info/${userId}`);
    return response.data;
  },

  // 티어 범위로 게시글 필터링 (TierRange 기반)
  fetchPostsByTierAndMatch: async (minTier, minDivision, minLp, maxTier, maxDivision, maxLp, matchType) => {
    const params = {
      minTier,
      minDivision,
      minLp: minLp || 0,
      maxTier,
      maxDivision,
      maxLp: maxLp || 99,
    };
    
    // 매치 타입이 있을 때와 없을 때 다른 엔드포인트 사용
    if (matchType) {
      params.matchType = matchType;
      const response = await api.get('/api/find-team/posts/filter-by-tier-and-match', { params });
      return response.data;
    } else {
      const response = await api.get('/api/find-team/posts/filter-by-tier', { params });
      return response.data;
    }
  }
};
