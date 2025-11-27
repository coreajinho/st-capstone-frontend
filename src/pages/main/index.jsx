import mascot from '@/assets/images/mascot.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const [summonerName, setSummonerName] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (summonerName.trim()) {
            navigate(`/summoner/${encodeURIComponent(summonerName.trim())}`);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-200px)] gap-8">
            {/* Mascot */}
            <div className="mt-4 w-full max-w-xl">
                <img 
                    src={mascot} 
                    alt="Fair.GG Mascot" 
                    className="w-full h-auto"
                />
            </div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="소환사명을 입력하세요"
                        value={summonerName}
                        onChange={(e) => setSummonerName(e.target.value)}
                        className="flex-1 h-14 text-lg px-6 rounded-full border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button 
                        type="submit" 
                        className="h-14 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                        검색
                    </Button>
                </div>
            </form>

        </div>
    );
}

export default MainPage;
