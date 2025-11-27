import { debateApi } from "@/apis/debateApi";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NewDebatePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    writer: "",
    coWriter: "",
    videoUrl: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const positions = ["TOP", "JUG","MID", "BOT", "SUP"];

  // Load existing post data in edit mode
  useEffect(() => {
    const fetchPostData = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const postData = await debateApi.getPost(id);
          setFormData({
            title: postData.title,
            content: postData.content,
            writer: postData.writer,
            coWriter: postData.coWriter || "",
            videoUrl: postData.videoUrl || "",
            tags: postData.tags || []
          });
        } catch (error) {
          console.error("게시글 로딩 실패:", error);
          alert("게시글을 불러오는데 실패했습니다.");
          navigate("/debate");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPostData();
  }, [id, isEditMode, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (selectedTags) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!formData.writer.trim()) {
      alert("작성자를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await debateApi.updatePost(id, formData);
        alert("토론이 성공적으로 수정되었습니다!");
        navigate(`/debate/${id}`);
      } else {
        await debateApi.createPost(formData);
        alert("토론이 성공적으로 작성되었습니다!");
        navigate("/debate");
      }
    } catch (error) {
      console.error(isEditMode ? "토론 수정 실패:" : "토론 작성 실패:", error);
      alert(isEditMode ? "토론 수정에 실패했습니다. 다시 시도해주세요." : "토론 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto text-center py-12">게시글을 불러오는 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{isEditMode ? "토론 수정" : "새 토론"}</h1>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {/* 제목 */}
          <Field>
            <FieldLabel htmlFor="title">제목</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="토론 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </FieldContent>
          </Field>

          {/* 내용 */}
          <Field>
            <FieldLabel htmlFor="content">내용</FieldLabel>
            <FieldContent>
              <textarea
                id="content"
                className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="토론 내용을 입력하세요"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                required
              />
            </FieldContent>
          </Field>

          {/* 작성자 */}
          <Field>
            <FieldLabel htmlFor="writer">작성자</FieldLabel>
            <FieldContent>
              <Input
                id="writer"
                placeholder="작성자 이름을 입력하세요"
                value={formData.writer}
                onChange={(e) => handleInputChange("writer", e.target.value)}
                required
              />
            </FieldContent>
          </Field>

          {/* 공동 작성자 */}
          <Field>
            <FieldLabel htmlFor="coWriter">공동 작성자</FieldLabel>
            <FieldContent>
              <FieldDescription>선택사항입니다</FieldDescription>
              <Input
                id="coWriter"
                placeholder="공동 작성자 이름을 입력하세요"
                value={formData.coWriter}
                onChange={(e) => handleInputChange("coWriter", e.target.value)}
              />
            </FieldContent>
          </Field>

          {/* 비디오 URL */}
          <Field>
            <FieldLabel htmlFor="videoUrl">비디오 URL</FieldLabel>
            <FieldContent>
              <FieldDescription>YouTube 링크 등 비디오 URL을 입력하세요 (선택사항)</FieldDescription>
              <Input
                id="videoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              />
            </FieldContent>
          </Field>

          {/* 태그 선택 */}
          <Field>
            <FieldLabel>포지션 태그</FieldLabel>
            <FieldContent>
              <FieldDescription>원하는 포지션을 선택하세요</FieldDescription>
              <ToggleGroup
                type="multiple"
                value={formData.tags}
                onValueChange={handleTagsChange}
                className="flex-row justify-start gap-2"
              >
                {positions.map((position) => (
                  <ToggleGroupItem
                    key={position}
                    value={position}
                    className="px-4 py-1 text-sm rounded-full data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    {position}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldContent>
          </Field>

          {/* 제출 버튼 */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => isEditMode ? navigate(`/debate/${id}`) : navigate("/debate")}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditMode ? "수정 중..." : "작성 중...") : (isEditMode ? "토론 수정" : "토론 작성")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
