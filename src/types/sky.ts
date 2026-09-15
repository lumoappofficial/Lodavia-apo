export type CelestialType = 'planet' | 'star' | 'moon' | 'sun' | 'constellation' | 'dso' | 'satellite' | 'event';

export interface CelestialBody {
  id: string;
  nameAr: string;
  nameEn: string;
  type: CelestialType;
  ra: number; // Right Ascension in hours (0 to 24)
  dec: number; // Declination in degrees (-90 to +90)
  magnitude: number; // Visual magnitude (brightness)
  distanceLightYears?: number;
  distanceAuOrKm?: string;
  constellationAr?: string;
  constellationEn?: string;
  color: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
  factsAr: string[];
  factsEn: string[];
  mythologyAr?: string;
  mythologyEn?: string;
  // Calculated live properties:
  azimuth?: number; // 0° North, 90° East, 180° South, 270° West
  altitude?: number; // -90° to +90° (- is below horizon, + is above)
  isVisible?: boolean; // altitude > 0
  screenX?: number; // Normalized (0 to 100)%
  screenY?: number; // Normalized (0 to 100)%
  inView?: boolean; // Within current camera FOV
  distanceFromCenter?: number; // Angular distance from camera center (degrees)
}

export interface ConstellationLine {
  id: string;
  nameAr: string;
  nameEn: string;
  stars: string[]; // List of star IDs to connect sequentially
}

export interface SkyObservationPoint {
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  timestamp: Date;
  heading: number; // Compass azimuth 0-360°
  pitch: number; // Tilt up/down (-90° to +90°)
  roll: number; // Rotation around phone axis
}

export interface MoonPhaseInfo {
  phaseNameAr: string;
  phaseNameEn: string;
  phaseCode: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  illuminationPercent: number;
  ageDays: number;
  moonriseTime: string;
  moonsetTime: string;
}

export interface SkyEventAlert {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'meteor_shower' | 'eclipse' | 'conjunction' | 'iss_pass' | 'supermoon';
  dateStr: string;
  peakTime: string;
  visibilityAr: string;
  visibilityEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
}
