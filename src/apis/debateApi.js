import { api } from "@/lib/axios";

export const debateApi = {
  // ---------------------------------------------------------------
  // 게시글 기능
  // ---------------------------------------------------------------

  // 게시글 목록 조회
  getPosts: async () => {
    const response = await api.get('/api/debate/posts');
    return response.data;
  },

  // 게시글 검색
  searchPosts: async (searchType, keyword) => {
    const response = await api.get('/api/debate/posts/search', {
      params: {
        searchType,
        keyword
      }
    });
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (id) => {
    const response = await api.get(`/api/debate/posts/${id}`);
    return response.data;
  },

  // 투표 결과 조회
  getVoteResult: async (id) => {
    const response = await api.get(`/api/debate/posts/${id}/vote-result`);
    return response.data;
  },

  // 댓글 목록 조회
  getComments: async (id) => {
    const response = await api.get(`/api/debate/posts/${id}/comments`);
    return response.data;
  },

  // 인기 게시글 조회
  getPopularPosts: async (popularType) => {
    const response = await api.get('/api/debate/posts/popular', {
      params: {
        popularType
      }
    });
    return response.data;
  },

  // 게시글 작성
  createPost: async (postData) => {
    const response = await api.post('/api/debate/posts', postData);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    const response = await api.put(`/api/debate/posts/${id}`, postData);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (id) => {
    await api.delete(`/api/debate/posts/${id}`);
  },

  // ---------------------------------------------------------------
  // 댓글 기능
  // ---------------------------------------------------------------

  // 댓글 작성
  createComment: async (postId, commentData) => {
    const response = await api.post(`/api/debate/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (postId, commentId, commentData) => {
    const response = await api.put(`/api/debate/posts/${postId}/comments/${commentId}`, commentData);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId) => {
    await api.delete(`/api/debate/posts/${postId}/comments/${commentId}`);
  }
};