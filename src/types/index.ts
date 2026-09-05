export type Language = 'hi' | 'mr' | 'en';

export type MaterialCategory = 
  | 'PCB'
  | 'Cable'
  | 'LCD'
  | 'Motor'
  | 'CRT'
  | 'Battery'
  | 'Magnet assembly'
  | 'Plastic';

export interface MaterialInfo {
  id: MaterialCategory;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  icon: string;
  avgPricePerKg: number;
  priceRange: { min: number; max: number };
  description: string;
  safetyHazard?: string;
  imageUrl: string;
}

export interface PriceRecord {
  id: string;
  material: MaterialCategory;
  location: string;
  date: string;
  unit: string;
  prevailingPrice: number;
  recyclerOfferRange: string;
  trend: 'up' | 'down' | 'stable';
  history7Days: { date: string; price: number }[];
}

export interface Recycler {
  recycler_id: string;
  name: string;
  location: string;
  distanceKm: number;
  materials_accepted: MaterialCategory[];
  authorization_details: string;
  authorization_status: 'Authorized' | 'Pending' | 'Unverified';
  contact: string;
  offered_rate_multiplier: number; // e.g. 1.02 for slightly higher offer
  pickup_available: boolean;
  service_area: string;
  reliability_score: number; // 0 - 100
  rating: number;
}

export interface RecyclerMatchResult {
  recycler: Recycler;
  distance: number;
  quotedPricePerKg: number;
  totalQuotedPrice: number;
  pickupAvailable: boolean;
  score: number;
  recommendationReason: string;
}

export type LotStatus = 
  | 'CREATED'
  | 'RECYCLER_SELECTED'
  | 'ACCEPTED_BY_RECYCLER'
  | 'HANDOVER_PENDING'
  | 'HANDOVER_VERIFIED'
  | 'PAYMENT_RECEIVED'
  | 'RECYCLED';

export type SyncStatus = 'PENDING_SYNC' | 'SYNCED';

export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER';

export interface Lot {
  lot_id: string;
  collector_id: string;
  material: MaterialCategory;
  material_description: string;
  photo_url: string;
  weight_kg: number;
  condition: 'Mixed' | 'Clean' | 'High Grade' | 'Damaged';
  estimated_value_min: number;
  estimated_value_max: number;
  quoted_price: number;
  final_price?: number;
  collection_location: string;
  collection_timestamp: string;
  recycler_id?: string;
  recycler_name?: string;
  handover_location?: string;
  handover_timestamp?: string;
  payment_method?: PaymentMethod;
  payment_status: 'PENDING' | 'COMPLETED';
  transaction_status: LotStatus;
  sync_status: SyncStatus;
  gps_coordinates?: { lat: number; lng: number };
  verified_weight_kg?: number;
  verified_photo_url?: string;
  anomaly_flag?: {
    is_anomaly: boolean;
    expected_price: number;
    actual_price: number;
    deviation_percent: number;
    reason: string;
  };
}

export interface CollectorProfile {
  collector_id: string;
  name: string;
  phone: string;
  preferred_language: Language;
  operating_area: string;
  lots_sold: number;
  total_earnings: number;
  pending_earnings: number;
}

export interface SafetyGuideline {
  id: string;
  material: string;
  titleHi: string;
  titleMr: string;
  titleEn: string;
  audioTextHi: string;
  audioTextMr: string;
  audioTextEn: string;
  warningLevel: 'CRITICAL' | 'WARNING' | 'INFO';
  icon: string;
  doList: string[];
  dontList: string[];
}
