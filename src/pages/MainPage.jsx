import { Button } from '@/components/ui/button';

function MainPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">메인 페이지</h1>
            <p className="text-lg text-gray-700">여기는 메인 페이지입니다.</p>
            <div className="space-y-2">
                <p className="text-sm text-gray-600">op.gg로 이동하기</p>
                <Button variant="link" asChild className="p-0 h-auto">
                    <a href="https://op.gg/ko" target="_blank" rel="noopener noreferrer">
                        op.gg
                    </a>
                </Button>
            </div>
        </div>
    );
}

export default MainPage;