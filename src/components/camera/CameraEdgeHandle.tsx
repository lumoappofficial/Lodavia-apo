import React from 'react';

interface CameraEdgeHandleProps {
  onOpen: () => void;
  isEdgeSwiping?: boolean;
  edgeProgress?: number;
  lang?: string;
}

/**
 * CameraEdgeHandle:
 * The floating camera button has been completely removed/hidden from the Home screen.
 * Camera access is powered exclusively by the invisible edge-swipe gesture in useGestureNavigation.
 */
export default function CameraEdgeHandle(_props: CameraEdgeHandleProps) {
  // Completely hidden - no visible floating button on screen
  return null;
}

