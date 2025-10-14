export type Category = "pharmacy" | "grocery" | "library";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "SENDER" | "RECIPIENT" | "BOTH";
}

export interface RestrictedEnvelope {
  id: string;
  issuerId: string;
  recipientId: string;
  amountCents: number;
  remainingCents: number;
  currency: string;
  categories: Category[];
  merchants?: string[];
  expiresAt?: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED" | "REVOKED";
  createdAt: string;
}

export interface Payin {
  id: string;
  userId: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  createdAt: string;
}

export interface Request {
  id: string;
  requesterId: string;
  targetIssuerId: string;
  amountCents: number;
  currency: string;
  categories: Category[];
  note?: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED";
  createdAt: string;
  decidedAt?: string;
}

export interface Merchant {
  id: string;
  legalName: string;
  categories: Category[];
  lat: number;
  lon: number;
  address: string;
}

export interface NotificationPayload {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}
