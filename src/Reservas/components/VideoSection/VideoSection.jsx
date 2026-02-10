import React from 'react';

const VideoSection = ({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  title = "Conoce Nuestras Instalaciones",
  description = "Descubre por qué somos la mejor opción para jugar fútbol en la ciudad"
}) => {
  // Convertir URL de YouTube a formato embed si es necesario
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <section className="py-8 md:py-10 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Video Container */}
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
            {/* Aspect Ratio Container */}
            <div className="relative pb-[56.25%]">
              <iframe
                src={getEmbedUrl(videoUrl)}
                title="Video de presentación"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Features */}
          <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
            <div className="flex items-center gap-2 p-2 md:p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base md:text-lg">🌿</span>
              </div>
              <div className="hidden sm:block min-w-0">
                <h4 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white truncate">Césped Premium</h4>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Última gen.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 md:p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base md:text-lg">💡</span>
              </div>
              <div className="hidden sm:block min-w-0">
                <h4 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white truncate">Iluminación LED</h4>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Juega de noche</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 md:p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base md:text-lg">🚿</span>
              </div>
              <div className="hidden sm:block min-w-0">
                <h4 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white truncate">Vestuarios</h4>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Cómodos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
