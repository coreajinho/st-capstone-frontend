import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 입력 검증
    if (!formData.username || !formData.password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await login(formData.username, formData.password);
      console.log('로그인 성공');
      alert('로그인 되었습니다!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response?.status === 401) {
        alert('사용자 이름 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleRiotLogin = () => {
    alert('준비중입니다');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">Fair.GG에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자 이름</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="사용자 이름을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            로그인
          </Button>
        </form>

        <Link to="/auth/signup" className="block">
          <Button variant="ghost" className="w-full" size="sm">
            회원가입
          </Button>
        </Link>

        <div className="relative">
          <Separator className="my-6" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
            소셜 로그인
          </span>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full hover:bg-red-50 hover:border-red-500 transition-colors"
            onClick={handleRiotLogin}
            title="Riot 계정으로 로그인"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
