import { teamApi } from "@/apis/teamApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NewTeamPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          const post = await teamApi.getPost(id);
          setTitle(post.title);
          setContent(post.content);
          setWriter(post.writer);
          setSelectedTags(post.tags || []);
        } catch (error) {
          console.error("게시글 로딩 실패:", error);
          setError("게시글을 불러오는데 실패했습니다.");
        }
      };
      loadPost();
    }
  }, [id, isEditMode]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (!writer.trim()) {
      setError("작성자를 입력해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      setError("모집 포지션을 하나 이상 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const postData = {
        title,
        content,
        writer,
        tags: selectedTags,
      };

      if (isEditMode) {
        await teamApi.updatePost(id, postData);
      } else {
        await teamApi.createPost(postData);
      }

      navigate("/findTeam");
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      setError("게시글 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/findTeam/${id}`);
    } else {
      navigate("/findTeam");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "팀원 모집글 수정" : "팀원 모집글 작성"}
      </h1>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Field>
            <Label>제목</Label>
            <Input
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </Field>

          <Field>
            <Label>내용</Label>
            <textarea
              className="w-full min-h-[200px] p-3 border rounded-md"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </Field>

          <Field>
            <Label>작성자</Label>
            <Input
              placeholder="작성자 이름을 입력하세요"
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              disabled={isLoading}
            />
          </Field>

          <Field>
            <Label>모집 포지션 (복수 선택 가능)</Label>
            <ToggleGroup
              type="multiple"
              value={selectedTags}
              onValueChange={setSelectedTags}
              className="justify-start"
              disabled={isLoading}
            >
              <ToggleGroupItem value="TOP" className="px-6">
                TOP
              </ToggleGroupItem>
              <ToggleGroupItem value="JUG" className="px-6">
                JUG
              </ToggleGroupItem>
              <ToggleGroupItem value="MID" className="px-6">
                MID
              </ToggleGroupItem>
              <ToggleGroupItem value="BOT" className="px-6">
                BOT
              </ToggleGroupItem>
              <ToggleGroupItem value="SUP" className="px-6">
                SUP
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="text-sm text-gray-600 mt-2">
              선택된 포지션: {selectedTags.join(", ") || "없음"}
            </div>
          </Field>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading
                ? "저장 중..."
                : isEditMode
                  ? "수정하기"
                  : "등록하기"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
