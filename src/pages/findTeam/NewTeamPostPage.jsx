import { findTeamApi } from "@/apis/findTeamApi";
import { TierRangeSlider } from "@/components/TierRangeSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NewTeamPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 티어 관련 상태
  const [writerTierInfo, setWriterTierInfo] = useState(null);
  const [tierInfoLoading, setTierInfoLoading] = useState(true);
  const [tierInfoError, setTierInfoError] = useState(false);
  const [matchType, setMatchType] = useState(null);
  const [selectedTierRange, setSelectedTierRange] = useState([
    { tier: "IRON", division: "IV", lp: 0 },
    { tier: "DIAMOND", division: "I", lp: 99 },
  ]);
  const [requireMasterPlus, setRequireMasterPlus] = useState(false);
  const [masterPlusLpCap, setMasterPlusLpCap] = useState("");

  // 작성자 티어 정보 불러오기
  useEffect(() => {
    const loadWriterTierInfo = async () => {
      if (!user?.id) {
        setTierInfoError(true);
        setTierInfoLoading(false);
        return;
      }

      try {
        setTierInfoLoading(true);
        setTierInfoError(false);
        const tierInfo = await findTeamApi.getWriterTierInfo(user.id);
        setWriterTierInfo(tierInfo);
      } catch (error) {
        console.error("티어 정보 조회 실패:", error);
        setTierInfoError(true);
        setError("티어 정보를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.");
      } finally {
        setTierInfoLoading(false);
      }
    };

    loadWriterTierInfo();
  }, [user]);

  // 티어 정보가 로드되고 매치 타입이 선택되면 슬라이더 범위 초기화
  useEffect(() => {
    if (writerTierInfo && matchType && !isEditMode) {
      const boundaries = getTierBoundaries();
      setSelectedTierRange([boundaries.minBoundary, boundaries.maxBoundary]);
    }
  }, [writerTierInfo, matchType, isEditMode]);

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          const post = await findTeamApi.getPost(id);
          setTitle(post.title);
          setContent(post.content);
          setSelectedTags(post.tags || []);
          setMatchType(post.matchType || null);
          if (post.minTier && post.maxTier) {
            setSelectedTierRange([post.minTier, post.maxTier]);
          }
          setRequireMasterPlus(post.requireMasterPlus || false);
          setMasterPlusLpCap(post.masterPlusLpCap || "");
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
    if (!matchType) {
      setError("매치 종류를 선택해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      setError("모집 포지션을 하나 이상 선택해주세요.");
      return;
    }
    // 솔로랭크는 포지션 1개 제한
    if (matchType === "SOLO_RANK" && selectedTags.length > 1) {
      setError("솔로랭크는 포지션을 1개만 선택할 수 있습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const postData = {
        title,
        content,
        writer: user?.username,
        writerId: user?.id,
        tags: selectedTags,
        matchType,
        minTier: selectedTierRange[0],
        maxTier: selectedTierRange[1],
        requireMasterPlus,
        masterPlusLpCap: masterPlusLpCap ? parseInt(masterPlusLpCap) : null,
      };

      if (isEditMode) {
        await findTeamApi.updatePost(id, postData);
      } else {
        await findTeamApi.createPost(postData);
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

  // 매치 타입별 티어 범위 계산
  const getTierBoundaries = () => {
    if (!writerTierInfo || !matchType) {
      return {
        minBoundary: { tier: "IRON", division: "IV", lp: 0 },
        maxBoundary: { tier: "DIAMOND", division: "I", lp: 99 },
      };
    }

    switch (matchType) {
      case "SOLO_RANK":
        return {
          minBoundary: writerTierInfo.soloRankMinTier,
          maxBoundary: writerTierInfo.soloRankMaxTier,
        };
      case "FLEX_RANK":
      case "OTHER_MODES":
        if (requireMasterPlus) {
          return {
            minBoundary: { tier: "EMERALD", division: "IV", lp: 0 },
            maxBoundary: { tier: "DIAMOND", division: "I", lp: 99 },
          };
        }
        return {
          minBoundary: writerTierInfo.flexRankMinTier,
          maxBoundary: writerTierInfo.flexRankMaxTier,
        };
      default:
        return {
          minBoundary: { tier: "IRON", division: "IV", lp: 0 },
          maxBoundary: { tier: "DIAMOND", division: "I", lp: 99 },
        };
    }
  };

  const boundaries = getTierBoundaries();

  // 솔로랭크 선택 가능 여부
  const canSelectSoloRank = writerTierInfo?.soloRankMinTier !== null;

  // 티어 정보 텍스트 생성 함수
  const getSoloTierText = () => {
    if (!writerTierInfo?.soloTier) {
      return "Unranked";
    }
    return `${writerTierInfo.soloTier} ${writerTierInfo.soloDivision || ""}`;
  };

  const getFlexTierText = () => {
    if (!writerTierInfo?.flexTier) {
      return "Unranked";
    }
    return `${writerTierInfo.flexTier} ${writerTierInfo.flexDivision || ""}`;
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

          {tierInfoLoading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              티어 정보를 불러오는 중...
            </div>
          )}

          {tierInfoError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              티어 정보를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.
            </div>
          )}

          {/* 사용자 티어 정보 */}
          {writerTierInfo && !tierInfoLoading && (
            <div className="text-sm text-gray-700">
              사용자 티어: 솔로랭크 {getSoloTierText()} / 자유랭크 {getFlexTierText()}
            </div>
          )}

          {/* 매치 종류 선택 */}
          <Field>
            <Label>매치 종류</Label>
            <ToggleGroup
              type="single"
              value={matchType}
              onValueChange={setMatchType}
              className="justify-start"
              disabled={isLoading || tierInfoLoading || tierInfoError}
            >
              <ToggleGroupItem
                value="SOLO_RANK"
                className="px-6"
                disabled={!canSelectSoloRank}
              >
                🏆 솔로랭크
              </ToggleGroupItem>
              <ToggleGroupItem value="FLEX_RANK" className="px-6">
                🎮 자유랭크
              </ToggleGroupItem>
              <ToggleGroupItem value="OTHER_MODES" className="px-6">
                ⚔️ 기타 모드
              </ToggleGroupItem>
            </ToggleGroup>
            {!canSelectSoloRank && (
              <div className="text-sm text-red-600 mt-2">
                ⚠️ 마스터 이상은 솔로랭크 듀오가 불가능합니다.
              </div>
            )}
          </Field>

          {/* 티어 범위 선택 */}
          {matchType && writerTierInfo && (
            <Field>
              <Label>모집 티어 범위</Label>
              <TierRangeSlider
                matchType={matchType}
                minBoundary={boundaries.minBoundary}
                maxBoundary={boundaries.maxBoundary}
                value={selectedTierRange}
                onChange={setSelectedTierRange}
                disabled={isLoading}
                requireMasterPlus={requireMasterPlus}
                onMasterPlusChange={setRequireMasterPlus}
              />
            </Field>
          )}

          {/* LP Cap 입력 (Master+ 체크 시) */}
          {requireMasterPlus && (matchType === "FLEX_RANK" || matchType === "OTHER_MODES") && (
            <Field>
              <Label>Master+ LP 상한 (0~9999, 비워두면 무제한)</Label>
              <Input
                type="number"
                min="0"
                max="9999"
                placeholder="무제한"
                value={masterPlusLpCap}
                onChange={(e) => setMasterPlusLpCap(e.target.value)}
                disabled={isLoading}
              />
            </Field>
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
            <Label>
              모집 포지션 {matchType === "SOLO_RANK" && "(최대 1개)"}
            </Label>
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
