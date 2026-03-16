const { PrismaClient, RegType, RiskLevel, Domain } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Simple helper to log what we seed
  console.log('🌱 Seeding sample regulations for ENVIRONNEMENT and SST domains...');

  await prisma.regulation.upsert({
    where: { id: 'env-reg-1' },
    update: {},
    create: {
      id: 'env-reg-1',
      title: "Gestion des déchets industriels",
      type: RegType.LOI,
      reference: 'ENV-LOI-001',
      ministry: 'Ministère de l’Environnement',
      authority: 'Agence nationale de l’environnement',
      summary:
        "Cadre général pour la gestion, le tri et la traçabilité des déchets industriels et dangereux.",
      publicationDate: new Date('2023-03-15'),
      riskLevel: RiskLevel.CRITIQUE,
      domain: Domain.ENVIRONNEMENT,
      fileUrl: null,
    },
  });

  await prisma.regulation.upsert({
    where: { id: 'env-reg-2' },
    update: {},
    create: {
      id: 'env-reg-2',
      title: "Émissions atmosphériques des installations classées",
      type: RegType.DECRET,
      reference: 'ENV-DEC-010',
      ministry: 'Ministère de l’Environnement',
      authority: 'Inspection des installations classées',
      summary:
        "Limitation des émissions de polluants atmosphériques et obligations de suivi pour les sites industriels.",
      publicationDate: new Date('2022-11-02'),
      riskLevel: RiskLevel.MOYEN,
      domain: Domain.ENVIRONNEMENT,
      fileUrl: null,
    },
  });

  await prisma.regulation.upsert({
    where: { id: 'sst-reg-1' },
    update: {},
    create: {
      id: 'sst-reg-1',
      title: "Prévention des risques professionnels",
      type: RegType.LOI,
      reference: 'SST-LOI-100',
      ministry: 'Ministère du Travail',
      authority: 'Inspection du travail',
      summary:
        "Obligations générales de l’employeur en matière de santé, sécurité et prévention des risques au travail.",
      publicationDate: new Date('2021-05-10'),
      riskLevel: RiskLevel.MOYEN,
      domain: Domain.SST,
      fileUrl: null,
    },
  });

  await prisma.regulation.upsert({
    where: { id: 'sst-reg-2' },
    update: {},
    create: {
      id: 'sst-reg-2',
      title: "Équipements de protection individuelle (EPI)",
      type: RegType.ARRETE,
      reference: 'SST-ARR-207',
      ministry: 'Ministère du Travail',
      authority: 'Organisme de prévention',
      summary:
        "Exigences relatives au choix, à la mise à disposition et au contrôle des EPI pour les salariés exposés.",
      publicationDate: new Date('2020-09-01'),
      riskLevel: RiskLevel.FAIBLE,
      domain: Domain.SST,
      fileUrl: null,
    },
  });

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

