// [TEMP_UI_TEST] 백엔드 구현 전 주석처리
// eslint-disable-next-line no-unused-vars
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

export default function NewTeamPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    writer: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positions = ["TOP", "JUG", "MID", "BOT", "SUP"];

  // 수정 모드일 때 기존 게시글 데이터 로드
  useEffect(() => {
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석챒리 시작
    // const fetchPostData = async () => {
    //   if (isEditMode) {
    //     setIsLoading(true);
    //     try {
    //       const postData = await teamApi.getPost(id);
    //       setFormData({
    //         title: postData.title,
    //         content: postData.content,
    //         writer: postData.writer,
    //         tags: postData.tags || []
    //       });
    //     } catch (error) {
    //       console.error("게시글 로딩 실패:", error);
    //       alert("게시글을 불러오는데 실패했습니다.");
    //       navigate("/findTeam");
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   }
    // };
    // fetchPostData();
    
    // 더미 데이터 (수정 모드)
    if (isEditMode) {
      setFormData({
        title: "다이아 탑 라이너 구합니다!",
        content: "안녕하세요!\n\n현재 클래시 팀을 구성하고 있습니다.\n탑과 미드 포지션을 모집하고 있어요.",
        writer: "소환사1",
        tags: ["TOP", "MID"]
      });
    }
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석챒리 끝
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
    if (formData.tags.length === 0) {
      alert("최소 하나 이상의 포지션을 선택해주세요.");
      return;
    }

    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리
    setIsSubmitting(true);
    
    // 더미 알림
    setTimeout(() => {
      alert(isEditMode ? "게시글 수정 기능은 백엔드 구현 후 사용 가능합니다." : "게시글 작성 기능은 백엔드 구현 후 사용 가능합니다.");
      setIsSubmitting(false);
      navigate("/findTeam");
    }, 500);
    
    // try {
    //   if (isEditMode) {
    //     await teamApi.updatePost(id, formData);
    //     alert("팀원 모집글이 성공적으로 수정되었습니다!");
    //     navigate(`/findTeam/${id}`);
    //   } else {
    //     await teamApi.createPost(formData);
    //     alert("팀원 모집글이 성공적으로 작성되었습니다!");
    //     navigate("/findTeam");
    //   }
    // } catch (error) {
    //   console.error(isEditMode ? "게시글 수정 실패:" : "게시글 작성 실패:", error);
    //   alert(isEditMode ? "게시글 수정에 실패했습니다. 다시 시도해주세요." : "게시글 작성에 실패했습니다. 다시 시도해주세요.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{isEditMode ? "팀원 모집글 수정" : "새 팀원 모집"}</h1>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {/* 제목 */}
          <Field>
            <FieldLabel htmlFor="title">제목</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="팀원 모집 제목을 입력하세요"
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
                placeholder="팀원 모집 내용을 입력하세요"
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

          {/* 포지션 태그 선택 */}
          <Field>
            <FieldLabel>모집 포지션</FieldLabel>
            <FieldContent>
              <FieldDescription>구하고자 하는 포지션을 선택하세요 (복수 선택 가능)</FieldDescription>
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
              onClick={() => isEditMode ? navigate(`/findTeam/${id}`) : navigate("/findTeam")}
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
              {isSubmitting ? (isEditMode ? "수정 중..." : "작성 중...") : (isEditMode ? "모집글 수정" : "모집글 작성")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
