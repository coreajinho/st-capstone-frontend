import { debateApi } from "@/apis/debateApi"; // API 임포트
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MessageSquare, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅

export function DebateList({ selectedPositions = [] }) {
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]); // 게시글 데이터 상태
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState("TITLE"); // 검색 옵션
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드

  // 컴포넌트 마운트 시 데이터 Fetching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await debateApi.getPosts();
        // 백엔드 데이터 형식을 UI에 맞게 매핑 (필요시)
        setDebates(data);
      } catch (error) {
        console.error("게시글 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 검색 기능
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      // 검색어가 비어있으면 전체 목록 다시 불러오기
      setIsLoading(true);
      try {
        const data = await debateApi.getPosts();
        setDebates(data);
      } catch (error) {
        console.error("게시글 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const data = await debateApi.searchPosts(searchType, searchKeyword);
      setDebates(data);
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 입력 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 필터링 로직
  const filteredDebates = selectedPositions.length === 0
    ? debates
    : debates.filter(debate => 
        // 백엔드 태그 데이터와 포지션 필터 비교
        debate.tags && selectedPositions.every(position => debate.tags.includes(position))
      );

  // 시간 포맷팅 헬퍼 함수
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000 / 60; // 분 단위 차이

    if (diff < 60) return `${Math.floor(diff)}분 전`;
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div className="text-center py-10">게시글을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 검색창 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="제목" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TITLE">제목</SelectItem>
                  <SelectItem value="TITLE_CONTENT">제목+내용</SelectItem>
                  <SelectItem value="CONTENT">내용</SelectItem>
                  <SelectItem value="WRITER">작성자</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input 
              placeholder="검색" 
              className="flex-1" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/debate/new')}
            >
              새 토론
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 목록 */}
      {filteredDebates.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
            등록된 토론이 없습니다.
        </div>
      ) : (
        filteredDebates.map((debate) => (
          <Card
            key={debate.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/debate/${debate.id}`)} // [중요] 클릭 시 상세 페이지로 이동
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* 좌측: 투표수 (백엔드 리스트 API에 투표수가 없다면 임시로 아이콘만 표시하거나 0 처리) */}
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <div className="text-xl font-bold text-gray-400">
                    - 
                    {/* 현재 List API에는 voteCount가 없으므로 '-'로 표시. 
                        필요하다면 백엔드 List DTO에 투표수 필드를 추가해야 함 */}
                  </div>
                  <div className="text-xs text-gray-500">투표</div>
                </div>

                {/* 중앙: 제목 및 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 transition-colors">
                    {debate.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {/* 태그 표시 */}
                    {debate.tags && debate.tags.length > 0 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                            {debate.tags[0]}
                        </span>
                    )}
                    
                    <span>{debate.writer}</span>
                    <span>{formatTime(debate.createdAt)}</span>
                    
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{debate.comments ? debate.comments.length : 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{debate.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
