import { ObjectId } from 'mongodb';

export interface PropertyImage {
  url: string;
  publicId: string;
  alt?: string;
  isPrimary?: boolean;
  uploadedAt: Date;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyRule {
  id: string;
  name: string;
  description?: string;
  isAllowed: boolean;
}

export interface LocalProperty {
  _id?: ObjectId;
  ownerRezId: number; // The ID from OwnerRez
  name: string;
  description?: string;
  propertyType: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  maxPets: number;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  rules: PropertyRule[];
  pricing: {
    baseRate: number;
    currency: string;
    cleaningFee?: number;
    serviceFee?: number;
    taxes?: number;
  };
  availability: {
    checkInTime: string;
    checkOutTime: string;
    minStay: number;
    maxStay?: number;
  };
  policies: {
    cancellationPolicy: string;
    houseRules: string[];
    petPolicy?: string;
    smokingPolicy?: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'draft';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedWithOwnerRez: Date;
}

export interface PropertyCreateRequest {
  ownerRezId: number;
  name: string;
  description?: string;
  propertyType: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  maxPets: number;
  pricing: {
    baseRate: number;
    currency: string;
    cleaningFee?: number;
    serviceFee?: number;
    taxes?: number;
  };
  availability: {
    checkInTime: string;
    checkOutTime: string;
    minStay: number;
    maxStay?: number;
  };
  policies: {
    cancellationPolicy: string;
    houseRules: string[];
    petPolicy?: string;
    smokingPolicy?: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PropertyUpdateRequest extends Partial<PropertyCreateRequest> {
  status?: 'active' | 'inactive' | 'maintenance' | 'draft';
  isVerified?: boolean;
  images?: PropertyImage[];
  amenities?: PropertyAmenity[];
  rules?: PropertyRule[];
}
