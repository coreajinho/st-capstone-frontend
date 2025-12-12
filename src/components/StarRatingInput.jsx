import { Star } from 'lucide-react';
import { useState } from 'react';

export function StarRatingInput({ value = 0, onChange, disabled = false }) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          disabled={disabled}
          className={`transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`h-6 w-6 ${
              rating <= displayValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
