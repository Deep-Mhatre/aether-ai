import prisma from './prisma.js';

const DAILY_CREDITS = 20;
let hasWarnedMissingCreditsColumn = false;

const getStartOfTodayUtc = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
};

export const refreshDailyCreditsIfNeeded = async (userId: string) => {
  try {
    const todayStartUtc = getStartOfTodayUtc();
    const users = await prisma.$queryRaw<Array<{ creditsLastRefreshedAt: Date | null }>>`
      SELECT "creditsLastRefreshedAt"
      FROM "user"
      WHERE id = ${userId}
      LIMIT 1
    `;
    const user = users[0];

    if (!user) return;

    if (!user.creditsLastRefreshedAt || user.creditsLastRefreshedAt < todayStartUtc) {
      await prisma.$executeRaw`
        UPDATE "user"
        SET
          credits = ${DAILY_CREDITS},
          "creditsLastRefreshedAt" = ${new Date()}
        WHERE
          id = ${userId}
          AND ("creditsLastRefreshedAt" IS NULL OR "creditsLastRefreshedAt" < ${todayStartUtc})
      `;
    }
  } catch (error: any) {
    const isMissingColumn =
      error?.code === '42703' ||
      (error?.code === 'P2010' && error?.meta?.code === '42703');

    if (isMissingColumn) {
      if (!hasWarnedMissingCreditsColumn) {
        hasWarnedMissingCreditsColumn = true;
        console.warn('Daily credit refresh skipped: missing "creditsLastRefreshedAt" column. Run Prisma migration.');
      }
      return;
    }
    throw error;
  }
};
