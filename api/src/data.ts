import { nanoid } from "nanoid";
import { Category, Merchant, Payin, Request, RestrictedEnvelope, User } from "./types.js";

interface ActivityEntry {
  id: string;
  userId: string;
  kind: "TOP_UP" | "SEND" | "REQUEST" | "PAYMENT" | "REFUND";
  title: string;
  description: string;
  createdAt: string;
}

const users: User[] = [
  { id: "user-a", email: "alice@caddy.money", name: "Alice", role: "BOTH" },
  { id: "user-b", email: "bruno@caddy.money", name: "Bruno", role: "BOTH" },
  { id: "user-c", email: "chloe@caddy.money", name: "Chloé", role: "RECIPIENT" },
];

const merchants: Merchant[] = [
  {
    id: "pharma-1",
    legalName: "Pharmacie République",
    categories: ["pharmacy"],
    lat: 48.8675,
    lon: 2.3636,
    address: "14 Rue du Temple, Paris"
  },
  {
    id: "pharma-2",
    legalName: "Pharmacie du Canal",
    categories: ["pharmacy"],
    lat: 48.8704,
    lon: 2.3643,
    address: "3 Quai de Jemmapes, Paris"
  },
  {
    id: "grocery-1",
    legalName: "Épicerie Locale",
    categories: ["grocery"],
    lat: 48.8692,
    lon: 2.3508,
    address: "22 Rue des Petits Champs, Paris"
  },
  {
    id: "grocery-2",
    legalName: "Marché St Martin",
    categories: ["grocery"],
    lat: 48.8707,
    lon: 2.357,
    address: "31 Rue du Château d'Eau, Paris"
  },
  {
    id: "library-1",
    legalName: "Librairie Soleil",
    categories: ["library"],
    lat: 48.8662,
    lon: 2.3524,
    address: "5 Rue des Francs Bourgeois, Paris"
  },
  {
    id: "library-2",
    legalName: "Librairie du Canal",
    categories: ["library"],
    lat: 48.872,
    lon: 2.3588,
    address: "9 Quai de Valmy, Paris"
  }
];

const payins: Payin[] = [];
const restricted: RestrictedEnvelope[] = [
  {
    id: "restricted-1",
    issuerId: "user-a",
    recipientId: "user-b",
    amountCents: 8000,
    remainingCents: 8000,
    currency: "EUR",
    categories: ["pharmacy", "grocery"],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  }
];

const requests: Request[] = [];
const activities: ActivityEntry[] = [];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUser(id: string) {
  return users.find((u) => u.id === id) ?? null;
}

export function getMerchants(filter?: { category?: Category; radiusKm?: number; lat?: number; lon?: number }) {
  let results = merchants.filter((m) => true);
  if (filter?.category) {
    results = results.filter((m) => m.categories.includes(filter.category!));
  }
  return results;
}

export function createPayin(userId: string, amountCents: number): Payin {
  const payin: Payin = {
    id: nanoid(),
    userId,
    amountCents,
    currency: "EUR",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  payins.push(payin);
  activities.push({
    id: nanoid(),
    userId,
    kind: "TOP_UP",
    title: "Virement initié",
    description: `+${(amountCents / 100).toFixed(2)} € en attente`,
    createdAt: new Date().toISOString(),
  });
  return payin;
}

export function markPayinSucceeded(id: string) {
  const payin = payins.find((p) => p.id === id);
  if (!payin) return null;
  payin.status = "SUCCEEDED";
  activities.push({
    id: nanoid(),
    userId: payin.userId,
    kind: "TOP_UP",
    title: "Virement confirmé",
    description: `+${(payin.amountCents / 100).toFixed(2)} € disponible`,
    createdAt: new Date().toISOString(),
  });
  return payin;
}

export function getPayin(id: string) {
  return payins.find((p) => p.id === id) ?? null;
}

export function listRestrictedForRecipient(userId: string) {
  return restricted.filter((r) => r.recipientId === userId);
}

export function listRestrictedForIssuer(userId: string) {
  return restricted.filter((r) => r.issuerId === userId);
}

export function createRestricted(params: {
  issuerId: string;
  recipientId: string;
  amountCents: number;
  categories: Category[];
  merchants?: string[];
  expiresAt?: string;
}) {
  const issuance: RestrictedEnvelope = {
    id: nanoid(),
    issuerId: params.issuerId,
    recipientId: params.recipientId,
    amountCents: params.amountCents,
    remainingCents: params.amountCents,
    currency: "EUR",
    categories: params.categories,
    merchants: params.merchants,
    expiresAt: params.expiresAt,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };
  restricted.push(issuance);
  activities.push({
    id: nanoid(),
    userId: params.issuerId,
    kind: "SEND",
    title: "Montant envoyé",
    description: `${(params.amountCents / 100).toFixed(2)} € pour ${params.categories.join(", ")}`,
    createdAt: new Date().toISOString(),
  });
  activities.push({
    id: nanoid(),
    userId: params.recipientId,
    kind: "SEND",
    title: "Argent reçu",
    description: `${(params.amountCents / 100).toFixed(2)} € utilisable chez ${params.categories.join(", ")}`,
    createdAt: new Date().toISOString(),
  });
  return issuance;
}

export function spendRestricted(params: {
  restrictedId: string;
  merchantId: string;
  amountCents: number;
}) {
  const item = restricted.find((r) => r.id === params.restrictedId);
  if (!item) throw new Error("Not found");
  if (item.status !== "ACTIVE") throw new Error("Inactive");
  if (item.remainingCents < params.amountCents) throw new Error("Insufficient");
  const merchant = merchants.find((m) => m.id === params.merchantId);
  if (!merchant) throw new Error("Merchant");
  const overlapsCategory = merchant.categories.some((c) => item.categories.includes(c));
  if (!overlapsCategory) throw new Error("CATEGORY_MISMATCH");
  if (item.merchants && !item.merchants.includes(merchant.id)) {
    throw new Error("MERCHANT_NOT_ALLOWED");
  }
  item.remainingCents -= params.amountCents;
  if (item.remainingCents === 0) {
    item.status = "REDEEMED";
  }
  activities.push({
    id: nanoid(),
    userId: item.recipientId,
    kind: "PAYMENT",
    title: merchant.legalName,
    description: `-${(params.amountCents / 100).toFixed(2)} € (${merchant.categories.join(", ")})`,
    createdAt: new Date().toISOString(),
  });
  activities.push({
    id: nanoid(),
    userId: item.issuerId,
    kind: "PAYMENT",
    title: `Paiement chez ${merchant.legalName}`,
    description: `${(params.amountCents / 100).toFixed(2)} €`,
    createdAt: new Date().toISOString(),
  });
  return { item, merchant };
}

export function createRequest(data: Omit<Request, "id" | "status" | "createdAt"> & { status?: Request["status"] }) {
  const request: Request = {
    id: nanoid(),
    requesterId: data.requesterId,
    targetIssuerId: data.targetIssuerId,
    amountCents: data.amountCents,
    currency: data.currency,
    categories: data.categories,
    note: data.note,
    status: data.status ?? "PENDING",
    createdAt: new Date().toISOString(),
    decidedAt: undefined,
  };
  requests.push(request);
  activities.push({
    id: nanoid(),
    userId: data.requesterId,
    kind: "REQUEST",
    title: "Demande envoyée",
    description: `${(data.amountCents / 100).toFixed(2)} € pour ${data.categories.join(", ")}`,
    createdAt: new Date().toISOString(),
  });
  return request;
}

export function setRequestStatus(id: string, status: Request["status"]) {
  const req = requests.find((r) => r.id === id);
  if (!req) return null;
  req.status = status;
  req.decidedAt = new Date().toISOString();
  activities.push({
    id: nanoid(),
    userId: req.requesterId,
    kind: "REQUEST",
    title: status === "APPROVED" ? "Demande approuvée" : status === "DECLINED" ? "Demande refusée" : "Demande mise à jour",
    description: `${(req.amountCents / 100).toFixed(2)} €`,
    createdAt: new Date().toISOString(),
  });
  return req;
}

export function listRequestsForUser(userId: string) {
  return requests.filter((r) => r.requesterId === userId || r.targetIssuerId === userId);
}

export function listActivity(userId: string) {
  return activities
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function computeSenderBalance(userId: string) {
  const totalTopUps = payins
    .filter((p) => p.userId === userId && p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amountCents, 0);
  const sent = restricted.filter((r) => r.issuerId === userId).reduce((sum, r) => sum + r.amountCents, 0);
  return totalTopUps - sent;
}

export function computeRecipientCategoryBalance(userId: string) {
  const list = listRestrictedForRecipient(userId);
  const byCategory = new Map<Category, { total: number; expiresAt?: string }>();
  for (const item of list) {
    for (const category of item.categories) {
      const existing = byCategory.get(category) ?? { total: 0, expiresAt: item.expiresAt };
      existing.total += item.remainingCents;
      if (item.expiresAt && (!existing.expiresAt || existing.expiresAt < item.expiresAt)) {
        existing.expiresAt = item.expiresAt;
      }
      byCategory.set(category, existing);
    }
  }
  return Array.from(byCategory.entries()).map(([category, data]) => ({
    category,
    remainingCents: data.total,
    expiresAt: data.expiresAt,
  }));
}

export function getMerchantsByIds(ids: string[]) {
  return merchants.filter((m) => ids.includes(m.id));
}

export function listAllUsers() {
  return users;
}
