import { useState, useEffect } from 'react';

// 使用 lodash 的 throttle 函数来节流滚动事件
import { throttle } from 'lodash-es';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (document.documentElement.scrollTop > 500 || document.body.scrollTop > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 100); // 节流函数，100ms 内最多执行一次

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-4 p-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-secondary/90 focus:outline-none border border-border"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 transform rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19l-7-7h3.5V5.5a2.25 2.25 0 0 1 4.5 0V12h3.5L12 19z"
          />
        </svg>
      </button>
    )
  );
};

export default BackToTopButton;
