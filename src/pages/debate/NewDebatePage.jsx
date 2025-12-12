import { authApi } from "@/apis/authApi";
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
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NewDebatePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { user } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    videoUrl: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // CoWriter 관련 상태
  const [enableCoWriter, setEnableCoWriter] = useState(false);
  const [coWriterRiotName, setCoWriterRiotName] = useState("");
  const [coWriterRiotTag, setCoWriterRiotTag] = useState("");
  const [coWriterId, setCoWriterId] = useState(null);
  const [coWriterDisplayName, setCoWriterDisplayName] = useState("");
  const [isCoWriterValidated, setIsCoWriterValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

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
            videoUrl: postData.videoUrl || "",
            tags: postData.tags || []
          });
          
          // 수정 모드에서 coWriter가 있으면 표시만 하고 변경 불가
          if (postData.coWriter && postData.coWriterId) {
            setEnableCoWriter(true);
            setCoWriterDisplayName(postData.coWriter);
            setCoWriterId(postData.coWriterId);
            setIsCoWriterValidated(true);
          }
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

  // CoWriter 검증 처리
  const handleValidateCoWriter = async () => {
    if (!coWriterRiotName.trim() || !coWriterRiotTag.trim()) {
      alert("라이엇 닉네임과 태그를 모두 입력해주세요.");
      return;
    }

    setIsValidating(true);
    try {
      const result = await authApi.validateCoWriter(coWriterRiotName.trim(), coWriterRiotTag.trim());
      
      if (result.isValid) {
        setCoWriterId(result.userId);
        setCoWriterDisplayName(result.displayName);
        setIsCoWriterValidated(true);
        alert(`${result.displayName}님을 공동 작성자로 추가합니다.`);
      } else {
        alert("회원가입되지 않은 사용자입니다.");
        setCoWriterId(null);
        setCoWriterDisplayName("");
        setIsCoWriterValidated(false);
      }
    } catch (error) {
      console.error("CoWriter 검증 실패:", error);
      alert("검증 중 오류가 발생했습니다.");
    } finally {
      setIsValidating(false);
    }
  };

  // CoWriter 초기화
  const handleResetCoWriter = () => {
    setCoWriterRiotName("");
    setCoWriterRiotTag("");
    setCoWriterId(null);
    setCoWriterDisplayName("");
    setIsCoWriterValidated(false);
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

    // CoWriter 검증 체크
    if (enableCoWriter && !isCoWriterValidated) {
      alert("공동 작성자를 검색하여 확인해주세요. 또는 체크를 해제하여 공동 작성자 없이 작성하세요.");
      return;
    }

    const submitData = {
      ...formData,
      writerId: user?.id,
      coWriterId: enableCoWriter && isCoWriterValidated ? coWriterId : undefined
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await debateApi.updatePost(id, submitData);
        alert("토론이 성공적으로 수정되었습니다!");
        navigate(`/debate/${id}`);
      } else {
        await debateApi.createPost(submitData);
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

          {/* 공동 작성자 */}
          <Field>
            <FieldLabel>공동 작성자</FieldLabel>
            <FieldContent>
              <FieldDescription>선택사항입니다</FieldDescription>
              
              {/* 체크박스 */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="enableCoWriter"
                  checked={enableCoWriter}
                  onChange={(e) => {
                    setEnableCoWriter(e.target.checked);
                    if (!e.target.checked) {
                      handleResetCoWriter();
                    }
                  }}
                  disabled={isEditMode && isCoWriterValidated}
                  className="w-4 h-4"
                />
                <label htmlFor="enableCoWriter" className="text-sm">
                  공동 작성자 추가
                </label>
              </div>

              {/* CoWriter 입력 영역 */}
              {enableCoWriter && (
                <div className="border rounded-lg p-4 space-y-3">
                  {!isCoWriterValidated ? (
                    // 검증 전: 입력 폼
                    <>
                      <div className="flex gap-2">
                        <Input
                          placeholder="라이엇 닉네임"
                          value={coWriterRiotName}
                          onChange={(e) => setCoWriterRiotName(e.target.value)}
                          disabled={isValidating || isEditMode}
                          className="flex-1"
                        />
                        <Input
                          placeholder="태그 (예: kr1)"
                          value={coWriterRiotTag}
                          onChange={(e) => setCoWriterRiotTag(e.target.value)}
                          disabled={isValidating || isEditMode}
                          className="w-32"
                        />
                        {!isEditMode && (
                          <Button
                            type="button"
                            onClick={handleValidateCoWriter}
                            disabled={isValidating || !coWriterRiotName.trim() || !coWriterRiotTag.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isValidating ? "검색 중..." : "검색"}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        공동 작성자를 추가하려면 검색 버튼을 클릭하세요.
                      </p>
                    </>
                  ) : (
                    // 검증 후: 확인 메시지
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✓</span>
                        <span className="font-medium">{coWriterDisplayName}</span>
                        <span className="text-sm text-gray-600">님이 공동 작성자로 추가됩니다.</span>
                      </div>
                      {!isEditMode && (
                        <button
                          type="button"
                          onClick={handleResetCoWriter}
                          className="text-sm text-red-600 hover:underline"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  )}
                  
                  {isEditMode && isCoWriterValidated && (
                    <p className="text-sm text-gray-500">
                      수정 모드에서는 공동 작성자를 변경할 수 없습니다.
                    </p>
                  )}
                </div>
              )}
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
