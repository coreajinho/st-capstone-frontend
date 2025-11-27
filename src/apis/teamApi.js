import { api } from "@/lib/axios";

export const teamApi = {
  // ---------------------------------------------------------------
  // 게시글 기능
  // ---------------------------------------------------------------

  // 게시글 목록 조회
  getPosts: async () => {
    const response = await api.get('/api/team/posts');
    return response.data;
  },

  // 게시글 검색
  searchPosts: async (searchType, keyword) => {
    const response = await api.get('/api/team/posts/search', {
      params: {
        searchType,
        keyword
      }
    });
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (id) => {
    const response = await api.get(`/api/team/posts/${id}`);
    return response.data;
  },

  // 요청(댓글) 목록 조회
  getRequests: async (id) => {
    const response = await api.get(`/api/team/posts/${id}/requests`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (postData) => {
    const response = await api.post('/api/team/posts', postData);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    const response = await api.put(`/api/team/posts/${id}`, postData);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (id) => {
    await api.delete(`/api/team/posts/${id}`);
  },

  // ---------------------------------------------------------------
  // 요청(댓글) 기능
  // ---------------------------------------------------------------

  // 요청 작성
  createRequest: async (postId, requestData) => {
    const response = await api.post(`/api/team/posts/${postId}/requests`, requestData);
    return response.data;
  },

  // 요청 수정
  updateRequest: async (postId, requestId, requestData) => {
    const response = await api.put(`/api/team/posts/${postId}/requests/${requestId}`, requestData);
    return response.data;
  },

  // 요청 삭제
  deleteRequest: async (postId, requestId) => {
    await api.delete(`/api/team/posts/${postId}/requests/${requestId}`);
  },

  // 요청 수락
  acceptRequest: async (postId, requestId) => {
    const response = await api.post(`/api/team/posts/${postId}/requests/${requestId}/accept`);
    return response.data;
  }
};
