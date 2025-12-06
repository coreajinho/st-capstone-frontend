import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/apis/authApi';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    riotName: '',
    riotTag: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 사용자 이름 검증
    if (!formData.username) {
      newErrors.username = '사용자 이름을 입력해주세요.';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자 이름은 3자 이상이어야 합니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    // Riot Name 검증
    if (!formData.riotName) {
      newErrors.riotName = 'Riot Name을 입력해주세요.';
    } else if (formData.riotName.length < 3 || formData.riotName.length > 20) {
      newErrors.riotName = 'Riot Name은 3~20자 사이여야 합니다.';
    }

    // Riot Tag 검증
    if (!formData.riotTag) {
      newErrors.riotTag = 'Riot Tag를 입력해주세요.';
    } else if (formData.riotTag.length < 3 || formData.riotTag.length > 5) {
      newErrors.riotTag = 'Riot Tag는 3~5자 사이여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await authApi.signup(
        formData.username,
        formData.password,
        formData.riotName,
        formData.riotTag
      );
      
      console.log('회원가입 성공:', response);
      alert('회원가입이 완료되었습니다!');
      navigate('/auth/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      // 사용자 이름 중복 에러 처리
      if (error.response?.status === 409) {
        setErrors({ username: '이미 사용 중인 사용자 이름입니다.' });
      } else if (error.response?.status === 400) {
        alert('입력 정보를 확인해주세요.');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-600">Fair.GG 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자 이름 *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="3자 이상의 고유한 이름"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'border-red-500' : ''}
              required
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호 *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8자 이상의 비밀번호"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
              required
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={errors.passwordConfirm ? 'border-red-500' : ''}
              required
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-500">{errors.passwordConfirm}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Riot 계정 *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="riotName"
                name="riotName"
                type="text"
                placeholder="Riot Name"
                value={formData.riotName}
                onChange={handleChange}
                className={`flex-1 ${errors.riotName ? 'border-red-500' : ''}`}
                required
              />
              <span className="text-2xl font-bold text-gray-500">#</span>
              <Input
                id="riotTag"
                name="riotTag"
                type="text"
                placeholder="Tag"
                value={formData.riotTag}
                onChange={handleChange}
                className={`w-24 ${errors.riotTag ? 'border-red-500' : ''}`}
                maxLength={5}
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                {errors.riotName && (
                  <p className="text-xs text-red-500">{errors.riotName}</p>
                )}
              </div>
              <div className="w-24">
                {errors.riotTag && (
                  <p className="text-xs text-red-500">{errors.riotTag}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            회원가입
          </Button>
        </form>

        <Link to="/auth/login" className="block">
          <Button variant="ghost" className="w-full" size="sm">
            이미 계정이 있으신가요? 로그인
          </Button>
        </Link>
      </div>
    </div>
  );
}
