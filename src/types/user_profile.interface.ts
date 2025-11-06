export interface IUserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  image?: string;
  image_id?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  date_of_birth?: string; // could also use Date if you plan to parse it
}
