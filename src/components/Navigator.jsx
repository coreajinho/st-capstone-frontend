import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Navigator() {
  return (
    <nav className="border-b bg-gray-50 px-5 py-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/">
            메인 페이지
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/debate">
            토론 페이지
          </Link>
        </Button>
      </div>
    </nav>
  );
}

export default Navigator;