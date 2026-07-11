export interface Domain {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export interface DomainResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface DomainRequestPayload {
  name: string;
  description?: string;
  image?: File | string;
}
    
export interface CreateDomainResponse {
  status?: number;
  message: string;
  domain: DomainResponse;
  image_url?: string;
}
export interface DomainsResponsePaginated {
  data: Domain[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

      
export interface  UpdateDomainPaylaod{
   name?: string ;
   image?:string;
   description?:string;
}