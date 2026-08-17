export type UserRole = 'USER' | 'DONOR' | 'NGO' | 'ADMIN';

export type ParticipationStatus = 
  | 'IDENTIFIED' 
  | 'CONTACTED' 
  | 'INTERESTED' 
  | 'REGISTERED' 
  | 'VERIFIED' 
  | 'ACTIVE_DONOR' 
  | 'NOT_INTERESTED';

export type BusinessType = 
  | 'Restaurant' 
  | 'Hotel' 
  | 'Canteen' 
  | 'Bakery' 
  | 'Supermarket' 
  | 'Catering Service' 
  | 'Community Kitchen' 
  | 'Other';

export type FoodCategory = 
  | 'Cooked Food' 
  | 'Bakery' 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Dairy' 
  | 'Packaged Food' 
  | 'Other';

export type DonationFrequency = 'Daily' | 'Weekly' | 'Occasionally' | 'Unknown';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organizationName?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface ContactHistory {
  id: string;
  foodBusinessId: string;
  contactDate: string;
  method: 'Phone Call' | 'In-Person Visit' | 'Email' | 'Registration' | 'Other';
  status: ParticipationStatus;
  notes: string;
  agentName: string;
}

export interface FoodBusiness {
  id: string;
  name: string;
  type: BusinessType;
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  phone: string;
  email: string;
  openingHours: string;
  foodCategories: FoodCategory[];
  potentialSurplus: string;
  donationFrequency: DonationFrequency;
  participationStatus: ParticipationStatus;
  isVerified: boolean;
  dataSource: 'RESEARCH' | 'DIRECT_CONTACT' | 'VOLUNTARY_REGISTRATION';
  lastContactedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DonationStatus = 'Available' | 'Requested' | 'Accepted' | 'Completed' | 'Expired' | 'Cancelled';

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  donorType: BusinessType;
  donorArea: string;
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: 'kg' | 'portions' | 'boxes' | 'items' | 'liters';
  preparationTime: string;
  expiryTime: string;
  description: string;
  imageUrl?: string;
  pickupAddress: string;
  latitude: number;
  longitude: number;
  status: DonationStatus;
  freshnessScore?: number; // AI calculated score 0-100
  freshnessNotes?: string;
  createdAt: string;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed';

export interface DonationRequest {
  id: string;
  donationId: string;
  foodName: string;
  donorName: string;
  donorArea: string;
  ngoId: string;
  ngoName: string;
  ngoContact: string;
  recipientNotes: string;
  requestedQuantity: number;
  unit: string;
  status: RequestStatus;
  requestedAt: string;
  completedAt?: string;
}

export type InventoryStatus = 'FRESH' | 'EXPIRING_SOON' | 'EXPIRED' | 'CONSUMED';

export interface HouseholdInventoryItem {
  id: string;
  userId: string;
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  status: InventoryStatus;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BUSINESS' | 'DONATION' | 'EXPIRY' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface ImpactAnalytics {
  registeredBusinesses: number;
  contactedBusinesses: number;
  verifiedPartners: number;
  activeDonors: number;
  verifiedNgos: number;
  foodSavedKg: number;
  successfulDonations: number;
  co2SavedKg: number;
  mealsProvided: number;
  statusBreakdown: Record<ParticipationStatus, number>;
}
