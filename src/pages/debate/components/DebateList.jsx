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
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅

export function DebateList({ selectedPositions = [] }) {
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]); // 게시글 데이터 상태
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState("TITLE"); // 검색 옵션
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드

  // 컴포넌트 마운트 시 데이터 Fetching(최초 한번만 실행)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await debateApi.getPosts();
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 포지션 필터를 통한 필터링 로직
  const filteredDebates =
    selectedPositions.length === 0
      // 아무 태그도 선택되지 않은 경우 모든 게시글 표시
      ? debates
      // 태그 선택시 해당 태그가 모두 포함된 게시글만 표시
      : debates.filter(
          (debate) =>
            // 백엔드 태그 데이터와 포지션 필터 비교
            debate.tags &&
            selectedPositions.every((position) =>
              debate.tags.includes(position)
            )
        );

  // 시간 포맷팅 헬퍼 함수
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000 / 60; // 분 단위 차이

    if (diff < 60) return `${Math.floor(diff)}분 전`; // 1시간 이내
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`; // 1일 이내
    if (diff < 60 * 24 * 7) return `${Math.floor(diff / 60 / 24)}일 전`; // 1주 이내
    if (diff < 60 * 24 * 30) return `${Math.floor(diff / 60 / 24 / 7)}주 전`; // 1달 이내
    if (diff < 60 * 24 * 365) return `${Math.floor(diff / 60 / 24 / 30)}달 전`; // 1년 이내
    return `${Math.floor(diff / 60 / 24 / 365)}년 전`; // 1년 이상
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
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/debate/new")}
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
          // 개별 게시글
          <Card
            key={debate.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/debate/${debate.id}`)} // [중요] 클릭 시 상세 페이지로 이동
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* 좌측: 투표수 */}
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <div className="text-xl font-bold text-gray-400">
                    {debate.commentCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">투표</div>
                </div>

                {/* 중앙: 제목 및 정보 */}
                <div className="flex-1 min-w-0">
                  {/* 글 제목 */}
                  <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 transition-colors">
                    {debate.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {/* 작성자*/}
                    <span>{debate.writer}</span>
                    {/* 작성 시간 */}
                    <span>{formatTime(debate.createdAt)}</span>
                    {/* 댓글 수(현재 투표수로 통일 추후 변경 가능)*/}
                    {/* <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{debate.commentCount}</span>
                    </div> */}
                    {/* 조회 수 */}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{debate.views}</span>
                    </div>
                    {/* 태그 표시 */}
                    {debate.tags && debate.tags.length > 0 && (
                      <div className="flex gap-1">
                        {debate.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
