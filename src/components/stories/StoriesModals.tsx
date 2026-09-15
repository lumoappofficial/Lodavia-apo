import React from 'react';
import { useStories } from '../../contexts/StoriesContext';
import { StoryCreatorModal } from './StoryCreatorModal';
import { StoryViewerModal } from './StoryViewerModal';

export function StoriesModals() {
  const { isCreatorOpen, activeGroupIndex } = useStories();

  return (
    <>
      {isCreatorOpen && <StoryCreatorModal />}
      {activeGroupIndex !== null && <StoryViewerModal />}
    </>
  );
}
