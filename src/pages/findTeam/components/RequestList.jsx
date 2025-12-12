import { findTeamApi } from "@/apis/findTeamApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function RequestList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // "all", "accepted", "pending"

  // 데이터 Fetching
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let data;
        if (filterType === "accepted") {
          data = await findTeamApi.getMyAcceptedRequests();
        } else if (filterType === "pending") {
          data = await findTeamApi.getMyPendingRequests();
        } else {
          data = await findTeamApi.getMyRequests();
        }
        setRequests(data);
      } catch (error) {
        console.error("요청 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [filterType]);

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

  if (isLoading) {
    return <div className="text-center py-10">요청을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 필터 토글 그룹 */}
      <Card>
        <CardContent className="pt-6">
          <ToggleGroup
            type="single"
            value={filterType}
            onValueChange={(value) => {
              if (value) setFilterType(value);
            }}
            className="justify-start gap-2"
          >
            <ToggleGroupItem
              value="all"
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white px-6"
            >
              전체
            </ToggleGroupItem>
            <ToggleGroupItem
              value="accepted"
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white px-6"
            >
              수락됨
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pending"
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white px-6"
            >
              일반
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* 요청 목록 */}
      {requests.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filterType === "accepted" && "수락된 요청이 없습니다."}
          {filterType === "pending" && "일반 요청이 없습니다."}
          {filterType === "all" && "등록된 요청이 없습니다."}
        </div>
      ) : (
        requests.map((request) => (
          <Card
            key={request.id}
            className={`hover:shadow-lg transition-shadow ${
              request.isAccepted ? "border-2 border-green-600 bg-green-50" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div 
                className="cursor-pointer"
                onClick={() => navigate(`/findTeam/${request.postId}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        request.isAccepted
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {request.desiredTag}
                    </span>
                    {request.isAccepted && (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Check className="h-4 w-4" />
                        수락됨
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(request.createdAt)}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-gray-700 mb-3">
                  {request.content}
                </p>

                {request.postTitle && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    게시글: <span className="text-purple-600 font-medium">{request.postTitle}</span>
                  </div>
                )}
              </div>

              {/* 수락된 요청이고 게시글이 MATCHED 상태일 때 리뷰 버튼 표시 */}
              {request.isAccepted && request.postStatus === "MATCHED" && (
                <div className="mt-3 pt-3 border-t">
                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/review/write?postId=${request.postId}&mode=requester`);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    리뷰 작성
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
