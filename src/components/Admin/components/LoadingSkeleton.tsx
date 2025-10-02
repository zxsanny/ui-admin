import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="loading-skeleton"
          style={{
            height: '280px',
            borderRadius: '12px',
            background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
            marginBottom: '20px'
          }}
        />
      ))}
    </>
  );
};

export default LoadingSkeleton;
