export interface ShopRequest {
    name: string;
    description: string;
    location_type: 'google_maps' | 'coordinates';
    place_id?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone_number: string;
    email: string;
    social_links?: {
      instagram: string;
      facebook: string;
      twitter: string;
      tiktok: string;
      whatsapp: string;
    };
    operating_hours: {
      monday: string[] | boolean;
      tuesday: string[] | boolean;
      wednesday: string[] | boolean;
      thursday: string[] | boolean;
      friday: string[] | boolean;
      saturday: string[] | boolean;
      sunday: string[] | boolean;
    };
  }