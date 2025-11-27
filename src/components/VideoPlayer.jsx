/**
 * VideoPlayer Component
 * Supports YouTube and other video platforms
 * Extracts video ID from various URL formats and embeds video player
 */
function VideoPlayer({ videoUrl }) {
  if (!videoUrl) {
    return null;
  }

  // YouTube URL에서 비디오 ID 추출
  const getYouTubeEmbedUrl = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    // 직접 embed URL이 입력된 경우
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // 기타 비디오 URL
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="video-player-container w-full aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Player"
      />
    </div>
  );
}

export default VideoPlayer;
