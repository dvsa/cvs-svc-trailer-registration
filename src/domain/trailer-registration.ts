export interface TrailerRegistration {
  vinOrChassisWithMake?: string;
  vin: string;
  make: string;
  trn: string;
  certificateExpiryDate: Date;
  certificateIssueDate: Date;
  reasonForDeregistration?: string;
  deregisterDate?: Date;
  archive?: TrailerRegistration[];
}

export interface DeregisterTrailerRequest {
  reasonForDeregistration: string;
  deregisterDate: Date;
}

export interface GetTrailerRequest {
  vin: string;
  make: string;
}
