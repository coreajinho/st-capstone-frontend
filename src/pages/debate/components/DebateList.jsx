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

export function DebateList({ selectedPositions = [] }) {
  // 더미 데이터
  const debates = [
    {
      id: 1,
      title: "T1의 우승 가능성은 어느 정도일까요?",
      category: "LCK",
      author: "페이커팬",
      time: "10분 전",
      votes: 42,
      comments: 15,
      views: 234,
      tags: ["MID", "TOP"],
    },
    {
      id: 2,
      title: "페이커 vs 쇼메이커, 누가 더 뛰어난 선수일까요?",
      category: "일반 토론",
      author: "롤고수",
      time: "25분 전",
      votes: 128,
      comments: 67,
      views: 1205,
      tags: ["MID"],
    },
    {
      id: 3,
      title: "초보자를 위한 정글 입문 가이드",
      category: "팁과 가이드",
      author: "정글러",
      time: "1시간 전",
      votes: 89,
      comments: 23,
      views: 456,
      tags: ["JUG"],
    },
    {
      id: 4,
      title: "신규 챔피언 밸런스 조정이 필요한가?",
      category: "일반 토론",
      author: "밸런스맨",
      time: "2시간 전",
      votes: 56,
      comments: 34,
      views: 678,
      tags: ["BOT", "SUP"],
    },
    {
      id: 5,
      title: "LCK vs LPL 어느 리그가 더 강할까?",
      category: "LCK",
      author: "리그분석가",
      time: "3시간 전",
      votes: 93,
      comments: 45,
      views: 892,
      tags: ["TOP", "MID", "JUG"],
    },
  ];

  // 필터링 로직: 선택된 포지션이 없으면 모든 게시글, 있으면 모든 선택된 태그를 가진 게시글만
  const filteredDebates = selectedPositions.length === 0
    ? debates
    : debates.filter(debate => 
        selectedPositions.every(position => debate.tags.includes(position))
      );

  return (
    <div className="space-y-4">
      {/* 검색창 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Select defaultValue="title">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="제목" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="title+content">제목+내용</SelectItem>
                  <SelectItem value="content">내용</SelectItem>
                  <SelectItem value="writer">작성자</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input placeholder="검색" className="flex-1" />
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 목록 */}
      {filteredDebates.map((debate) => (
        <Card
          key={debate.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {/* 좌측: 투표수 */}
              <div className="flex flex-col items-center justify-center min-w-[60px]">
                <div className="text-2xl font-bold text-purple-600">
                  {debate.votes}
                </div>
                <div className="text-xs text-gray-500">투표</div>
              </div>

              {/* 중앙: 제목 및 정보 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 transition-colors">
                  {debate.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                    {debate.category}
                  </span>
                  <span>{debate.author}</span>
                  <span>{debate.time}</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{debate.comments}</span>
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
      ))}
    </div>
  );
}
