import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface MainNavSection {
  path: string;
  id: string;
  labelAr: string;
  labelEn: string;
}

export const MAIN_NAV_SECTIONS: MainNavSection[] = [
  { path: '/home', id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
  { path: '/communities', id: 'communities', labelAr: 'المجتمعات', labelEn: 'Communities' },
  { path: '/lumo', id: 'lumo', labelAr: 'Lumo', labelEn: 'Lumo' },
  { path: '/messages', id: 'messages', labelAr: 'الرسائل', labelEn: 'Messages' },
  { path: '/profile', id: 'profile', labelAr: 'الملف الشخصي', labelEn: 'Profile' },
];

interface GestureOptions {
  enabled?: boolean;
  onOpenGlobalCamera?: () => void;
  lang?: string;
}

export function useGestureNavigation({
  enabled = true,
  onOpenGlobalCamera,
  lang = 'ar'
}: GestureOptions = {}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Active gesture states for visual feedback
  const [swipeProgress, setSwipeProgress] = useState<number>(0);
  const [edgeResistance, setEdgeResistance] = useState<'start' | 'end' | null>(null);
  const [isEdgeSwipingCamera, setIsEdgeSwipingCamera] = useState<boolean>(false);
  const [cameraEdgeProgress, setCameraEdgeProgress] = useState<number>(0);

  // Tracking refs
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    isCameraEdge: boolean;
    cancelled: boolean;
    directionLocked: 'none' | 'horizontal' | 'vertical';
    targetIgnored: boolean;
  }>({
    x: 0,
    y: 0,
    time: 0,
    isCameraEdge: false,
    cancelled: true,
    directionLocked: 'none',
    targetIgnored: false,
  });

  // Check if target is an interactive or scrollable element
  const isIgnoredElement = useCallback((target: HTMLElement | null): boolean => {
    if (!target) return false;

    // Check tags
    const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'VIDEO', 'AUDIO'];
    if (interactiveTags.includes(target.tagName)) {
      return true;
    }

    // Check content editable
    if (target.isContentEditable) return true;

    // Suppress gestures if any modal or dialog is open
    if (typeof document !== 'undefined') {
      const isAnyModalOpen = document.querySelector('[role="dialog"]') !== null || 
        document.body.classList.contains('overflow-hidden') ||
        document.querySelector('.modal-open') !== null;
      if (isAnyModalOpen) return true;
    }

    // Check ancestors: drawers, carousels, reels, galleries, maps, chats, modals, sliders
    const ignoredSelector = [
      '[role="dialog"]',
      '[role="slider"]',
      '[role="menu"]',
      '[role="listbox"]',
      '[role="tabpanel"]',
      '[data-no-swipe]',
      '[data-reels]',
      '[data-carousel]',
      '[data-slider]',
      '[data-chat-window]',
      '[data-chat-messages]',
      '[data-chat]',
      '[data-drawer]',
      '[data-gallery]',
      '[data-stories]',
      '.modal',
      '.drawer',
      '.carousel',
      '.swiper',
      '.mapboxgl-map',
      '.leaflet-container',
      'canvas',
      'aside',
      'nav'
    ].join(',');

    if (target.closest(ignoredSelector)) {
      return true;
    }

    // Check horizontal scroll containers
    let current: HTMLElement | null = target;
    while (current && current !== document.body && current !== document.documentElement) {
      const style = window.getComputedStyle(current);
      const isScrollX = style.overflowX === 'auto' || style.overflowX === 'scroll';
      if (isScrollX && current.scrollWidth > current.clientWidth + 10) {
        // Parent has active horizontal scrolling (like stories, tabs, or card carousels)
        return true;
      }
      current = current.parentElement;
    }

    return false;
  }, []);

  // Determine current main section index
  const getCurrentSectionIndex = useCallback(() => {
    const currentPath = location.pathname;
    // Normalized check
    return MAIN_NAV_SECTIONS.findIndex(s => {
      if (s.path === '/home' && (currentPath === '/' || currentPath === '/home')) return true;
      return currentPath.startsWith(s.path);
    });
  }, [location.pathname]);

  const currentSectionIndex = getCurrentSectionIndex();
  const isMainSection = currentSectionIndex !== -1;

  useEffect(() => {
    if (!enabled) return;

    // Edge activation zone: narrow, approximately 20-30px
    const EDGE_ACTIVATION_WIDTH = 28;
    // Small margin (3px) from outer edge to prioritize native Android/iOS system navigation gestures
    const SYSTEM_GESTURE_MARGIN = 3;
    const MIN_CAMERA_INWARD_DIST = 45; // Clear inward movement required before triggering camera
    const MIN_HORIZONTAL_NAV_DIST = 65; // Deliberate swipe distance for section switching
    const MAX_VERTICAL_DEV = 35; // Max allowed vertical deviation before prioritizing vertical scroll
    const MIN_VELOCITY = 0.20; // px / ms

    const handleTouchStart = (e: TouchEvent) => {
      // Ignore multi-touch (pinching, zoom)
      if (e.touches.length !== 1) {
        touchStartRef.current.cancelled = true;
        return;
      }

      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const x = touch.clientX;
      const y = touch.clientY;

      const ignored = isIgnoredElement(target);

      // Safe vertical zone: avoid top header (< 56px) and bottom navigation bar (> screenHeight - 64px)
      const isInSafeVerticalBand = y >= 56 && y <= screenHeight - 64;

      // RTL / LTR: Active edge behaves logically according to interface direction
      const isRtl = lang === 'ar' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl');

      let isCameraEdge = false;
      if (!ignored && isInSafeVerticalBand) {
        if (isRtl) {
          // RTL (Arabic): Designated active edge is the RIGHT edge (inward is swiping left)
          isCameraEdge = x >= (screenWidth - EDGE_ACTIVATION_WIDTH) && x <= (screenWidth - SYSTEM_GESTURE_MARGIN);
        } else {
          // LTR (English): Designated active edge is the LEFT edge (inward is swiping right)
          isCameraEdge = x >= SYSTEM_GESTURE_MARGIN && x <= EDGE_ACTIVATION_WIDTH;
        }
      }

      touchStartRef.current = {
        x,
        y,
        time: Date.now(),
        isCameraEdge,
        cancelled: false,
        directionLocked: 'none',
        targetIgnored: ignored
      };

      setSwipeProgress(0);
      setEdgeResistance(null);
      setIsEdgeSwipingCamera(false);
      setCameraEdgeProgress(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const state = touchStartRef.current;
      if (state.cancelled || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - state.x;
      const deltaY = touch.clientY - state.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Lock direction after initial movement (8px)
      if (state.directionLocked === 'none') {
        if (absX > 8 || absY > 8) {
          if (absY > absX) {
            // Dominant vertical intent -> native vertical scroll, cancel gestures immediately!
            state.directionLocked = 'vertical';
            state.isCameraEdge = false;
            state.cancelled = true;
            return;
          } else {
            // Dominant horizontal intent
            state.directionLocked = 'horizontal';
          }
        }
      }

      if (state.directionLocked === 'vertical') {
        return;
      }

      const isRtl = lang === 'ar' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl');
      // Inward horizontal displacement from edge:
      // RTL: swiping left (negative deltaX) moves inward -> inwardDist = -deltaX
      // LTR: swiping right (positive deltaX) moves inward -> inwardDist = deltaX
      const inwardDist = isRtl ? -deltaX : deltaX;

      // 1. Check Camera Edge Swipe Gesture (only if touch started inside designated edge zone)
      if (state.isCameraEdge && inwardDist > 8) {
        if (absY < MAX_VERTICAL_DEV) {
          const edgeProgress = Math.min(1, Math.max(0, inwardDist / 80));
          setIsEdgeSwipingCamera(true);
          setCameraEdgeProgress(edgeProgress);
          return;
        } else {
          // Vertical drift exceeded -> user intended to scroll, cancel edge gesture
          state.isCameraEdge = false;
          setIsEdgeSwipingCamera(false);
          setCameraEdgeProgress(0);
        }
      }

      // 2. Main Navigation Swipe (Only on Main sections, when NOT an edge swipe, and not touching ignored element)
      if (!isMainSection || state.targetIgnored || state.isCameraEdge) {
        return;
      }

      // Boundary resistance checks
      if (absX > 15) {
        // Normal LTR & RTL intuitive direction:
        // deltaX < 0: swipe LEFT (moves next)
        // deltaX > 0: swipe RIGHT (moves prev)
        const isSwipingNext = deltaX < 0;
        const isSwipingPrev = deltaX > 0;

        if (isSwipingPrev && currentSectionIndex === 0) {
          // At first section, swiping right -> resistance!
          setEdgeResistance('start');
          setSwipeProgress(Math.min(30, absX * 0.2));
          return;
        }

        if (isSwipingNext && currentSectionIndex === MAIN_NAV_SECTIONS.length - 1) {
          // At last section, swiping left -> resistance!
          setEdgeResistance('end');
          setSwipeProgress(Math.min(30, absX * 0.2));
          return;
        }

        // Active navigation swipe progress
        setSwipeProgress(deltaX);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const state = touchStartRef.current;
      if (state.cancelled) {
        resetStates();
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - state.x;
      const deltaY = touch.clientY - state.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const elapsed = Math.max(1, Date.now() - state.time);
      const velocityX = absX / elapsed;

      const isRtl = lang === 'ar' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl');
      const inwardDist = isRtl ? -deltaX : deltaX;

      // 1. Process Camera Edge Trigger:
      // Must start in edge zone, clear inward horizontal movement, and minimal vertical drift
      const isCameraTriggered =
        state.isCameraEdge &&
        inwardDist >= MIN_CAMERA_INWARD_DIST &&
        absY < MAX_VERTICAL_DEV &&
        (velocityX >= MIN_VELOCITY || inwardDist >= 65);

      if (isCameraTriggered && onOpenGlobalCamera) {
        // Vibration feedback if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
        onOpenGlobalCamera();
        resetStates();
        return;
      }

      // 2. Process Main Navigation Swipe (Only for non-edge swipes on main sections)
      if (isMainSection && !state.targetIgnored && !state.isCameraEdge && state.directionLocked === 'horizontal') {
        const isDeliberate = absX >= MIN_HORIZONTAL_NAV_DIST && (velocityX >= MIN_VELOCITY || absX >= 100);

        if (isDeliberate && absY < MAX_VERTICAL_DEV * 1.5) {
          if (deltaX < 0) {
            // Swipe LEFT -> next section
            if (currentSectionIndex < MAIN_NAV_SECTIONS.length - 1) {
              const nextSec = MAIN_NAV_SECTIONS[currentSectionIndex + 1];
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(15);
              }
              navigate(nextSec.path);
            } else {
              // Edge bounce at end
              triggerResistanceVibrate();
            }
          } else if (deltaX > 0) {
            // Swipe RIGHT -> previous section
            if (currentSectionIndex > 0) {
              const prevSec = MAIN_NAV_SECTIONS[currentSectionIndex - 1];
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(15);
              }
              navigate(prevSec.path);
            } else {
              // Edge bounce at start
              triggerResistanceVibrate();
            }
          }
        }
      }

      resetStates();
    };

    const handleTouchCancel = () => {
      resetStates();
    };

    const triggerResistanceVibrate = () => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
      }
    };

    const resetStates = () => {
      touchStartRef.current.cancelled = true;
      setSwipeProgress(0);
      setEdgeResistance(null);
      setIsEdgeSwipingCamera(false);
      setCameraEdgeProgress(0);
    };

    // Attach passive listeners to window for smooth response without blocking native scroll
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    enabled,
    isMainSection,
    currentSectionIndex,
    isIgnoredElement,
    navigate,
    onOpenGlobalCamera,
    lang
  ]);

  return {
    isMainSection,
    currentSectionIndex,
    sections: MAIN_NAV_SECTIONS,
    swipeProgress,
    edgeResistance,
    isEdgeSwipingCamera,
    cameraEdgeProgress
  };
}
