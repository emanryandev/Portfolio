export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
  project_type?: string;
  budget?: string;
  service_id?: number;
  recipients?: number[];
}
