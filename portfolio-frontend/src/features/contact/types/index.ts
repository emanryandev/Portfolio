export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  project_type?: string;
  budget?: string;
  service_id?: string;
  recipients?: string[];
}
