import { PrismaClient, RestrictedStatus, RequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.restrictedMoney.deleteMany();
  await prisma.request.deleteMany();
  await prisma.payin.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  const [userA, userB, userC] = await Promise.all([
    prisma.user.create({ data: { email: "alice@caddy.money", name: "Alice" } }),
    prisma.user.create({ data: { email: "bruno@caddy.money", name: "Bruno" } }),
    prisma.user.create({ data: { email: "chloe@caddy.money", name: "Chloé" } })
  ]);

  const merchants = await prisma.merchant.createMany({
    data: [
      {
        legal_name: "Pharmacie République",
        categories: ["pharmacy"],
        is_whitelisted: true,
        payout_iban: "FR761234598765",
        lat: 48.8675,
        lon: 2.3636
      },
      {
        legal_name: "Pharmacie du Canal",
        categories: ["pharmacy"],
        is_whitelisted: true,
        payout_iban: "FR761234598766",
        lat: 48.8704,
        lon: 2.3643
      },
      {
        legal_name: "Épicerie Locale",
        categories: ["grocery"],
        is_whitelisted: true,
        payout_iban: "FR761234598767",
        lat: 48.8692,
        lon: 2.3508
      },
      {
        legal_name: "Marché St Martin",
        categories: ["grocery"],
        is_whitelisted: true,
        payout_iban: "FR761234598768",
        lat: 48.8707,
        lon: 2.3570
      },
      {
        legal_name: "Librairie Soleil",
        categories: ["library"],
        is_whitelisted: true,
        payout_iban: "FR761234598769",
        lat: 48.8662,
        lon: 2.3524
      },
      {
        legal_name: "Librairie du Canal",
        categories: ["library"],
        is_whitelisted: true,
        payout_iban: "FR761234598770",
        lat: 48.8720,
        lon: 2.3588
      }
    ]
  });

  const issuance = await prisma.restrictedMoney.create({
    data: {
      issuer_id: userA.id,
      recipient_id: userB.id,
      amount_cents: 8000,
      remaining_cents: 8000,
      currency: "EUR",
      categories: ["pharmacy", "grocery"],
      status: RestrictedStatus.ACTIVE
    }
  });

  await prisma.request.create({
    data: {
      requester_id: userB.id,
      target_issuer_id: userA.id,
      amount_cents: 3000,
      currency: "EUR",
      categories: ["library"],
      note: "Livres pour les enfants",
      status: RequestStatus.PENDING
    }
  });

  console.log("Seed completed", {
    userA: userA.email,
    userB: userB.email,
    userC: userC.email,
    issuance: issuance.id,
    merchants
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
