import { teamApi } from "@/apis/teamApi";
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
import { useNavigate } from "react-router-dom";

export function TeamList({ selectedPositions = [] }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState("TITLE");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 데이터 Fetching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await teamApi.getPosts();
        setPosts(data);
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
      setIsLoading(true);
      try {
        const data = await teamApi.getPosts();
        setPosts(data);
      } catch (error) {
        console.error("게시글 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const data = await teamApi.searchPosts(searchType, searchKeyword);
      setPosts(data);
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

  // 포지션 필터링
  const filteredPosts =
    selectedPositions.length === 0
      ? posts
      : posts.filter(
          (post) =>
            post.tags &&
            selectedPositions.every((position) =>
              post.tags.includes(position)
            )
        );

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000 / 60;

    if (diff < 60) return `${Math.floor(diff)}분 전`;
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
    if (diff < 60 * 24 * 7) return `${Math.floor(diff / 60 / 24)}일 전`;
    if (diff < 60 * 24 * 30) return `${Math.floor(diff / 60 / 24 / 7)}주 전`;
    if (diff < 60 * 24 * 365) return `${Math.floor(diff / 60 / 24 / 30)}달 전`;
    return `${Math.floor(diff / 60 / 24 / 365)}년 전`;
  };

  // 게시글 상태 표시 뱃지
  const getStatusBadge = (post) => {
    if (post.status === "EXPIRED") {
      return <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-md font-bold">만료됨</span>;
    }
    if (post.status === "PENDING_EXPIRATION") {
      return <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-md font-bold">만료 대기</span>;
    }
    return null;
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
              onClick={() => navigate("/findTeam/new")}
            >
              팀원 모집
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          등록된 팀원 모집글이 없습니다.
        </div>
      ) : (
        filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/findTeam/${post.id}`)}
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* 좌측: 요청 수 */}
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <div className="text-xl font-bold text-gray-400">
                    {post.requestCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">요청</div>
                </div>

                {/* 중앙: 제목 및 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>
                    {getStatusBadge(post)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <span>{post.writer}</span>
                    <span>{formatTime(post.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              post.acceptedTags && post.acceptedTags.includes(tag)
                                ? "bg-gray-300 text-gray-600"
                                : "bg-purple-100 text-purple-700"
                            }`}
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
