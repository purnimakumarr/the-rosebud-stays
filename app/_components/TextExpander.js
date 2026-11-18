'use client';

import { useState } from 'react';

const PREVIEW_WORDS = 40;

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = typeof children === 'string' ? children : '';
  const words = text.split(/\s+/).filter(Boolean);

  // Short descriptions need no "Show more"
  if (words.length <= PREVIEW_WORDS) return <span>{text}</span>;

  const displayText = isExpanded
    ? text
    : words.slice(0, PREVIEW_WORDS).join(' ') + '...';

  return (
    <span>
      {displayText}{' '}
      <button
        type='button'
        aria-expanded={isExpanded}
        className='text-primary-400 hover:text-accent-200 border-b border-primary-600 leading-3 pb-1 transition-colors'
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  );
}

export default TextExpander;
