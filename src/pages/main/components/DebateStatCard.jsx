import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebateStatCard({ debateStats, hasUserAccount }) {
  const isUnregistered = !hasUserAccount || !debateStats;

  if (isUnregistered) {
    return (
      <Card className="h-full bg-gray-50 opacity-60">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-purple-600">Fair Stat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-center">가입된 사용자가 아닙니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { debateWins, debateLosses, debateDraws, judgementSuccesses, judgementFailures } = debateStats;
  const totalDebates = debateWins + debateLosses + debateDraws;
  // 승률 계산 시 무승부는 무시 (승+패만 고려)
  const debateWinRate = (debateWins + debateLosses) > 0 ? ((debateWins / (debateWins + debateLosses)) * 100).toFixed(1) : 0;
  
  const totalJudgements = judgementSuccesses + judgementFailures;

  const hasNoDebateActivity = totalDebates === 0 && totalJudgements === 0;
  // 판결 승률 계산
  const judgementWinRate = totalJudgements > 0 ? ((judgementSuccesses / totalJudgements) * 100).toFixed(1) : 0;

  if (hasNoDebateActivity) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-purple-600">Fair Stat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            <p className="mb-2">📊</p>
            <p className="text-sm">아직 토론에 참여하지 않았습니다</p>
            <p className="text-xs text-gray-400 mt-2">토론 게시판에서 첫 토론을 시작해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-600">Fair Stat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 토론 참여 통계 - 위로 이동 */}
        {totalDebates > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">분쟁 승률</h3>
            
            {/* 티어 이미지 영역과 승/무/패 정보 */}
            <div className="flex items-center gap-4">
              {/* 승률 아이콘 */}
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <div className="text-5xl">🏦</div>
              </div>

              {/* 승/무/패 정보 */}
              <div className="flex-1 space-y-2">
                {/* 승/무/패 */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    <span className="text-blue-600 font-semibold">{debateWins}승</span>{" "}
                    <span className="text-gray-600 font-semibold">{debateDraws}무</span>{" "}
                    <span className="text-red-600 font-semibold">{debateLosses}패</span>
                  </span>
                </div>

                {/* 승률 그래프 */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${debateWinRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">
                    {debateWinRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 판결 성공률 */}
        {totalJudgements > 0 && (
          <div className={`space-y-3 ${totalDebates > 0 ? 'pt-3 border-t' : ''}`}>
            <h3 className="text-base font-semibold text-gray-900">판결 성공률</h3>
            
            {/* 판결 아이콘과 승/패 정보 */}
            <div className="flex items-center gap-4">
              {/* 판결 아이콘 */}
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <div className="text-5xl">⚖️</div>
              </div>

              {/* 승/패 정보 */}
              <div className="flex-1 space-y-2">
                {/* 승/패 */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    <span className="text-blue-600 font-semibold">{judgementSuccesses}승</span>{" "}
                    <span className="text-red-600 font-semibold">{judgementFailures}패</span>
                  </span>
                </div>

                {/* 성공률 그래프 */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${judgementWinRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">
                    {judgementWinRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
