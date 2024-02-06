import { CronInput } from "./@types/cron";
import { prisma } from "./lib/db.ts";
import logger from "./lib/logger.ts";
import * as cron from "node-cron";
import update from "./worker/cron_worker.ts";

const compList: CronInput[] = [];
const uniqueIds = new Set<string>();

cron.schedule("* * * * *", async () => {
  await updateComps();
});

async function updateComps() {
  const competitions = await prisma.competition.findMany();
  const activeComps = competitions.filter(
    (competition) => competition.currentlyUsed && competition.id != null
  );
  compList.length = 0;
  uniqueIds.clear();
  await Promise.all(
    activeComps.map(async (competition) => {
      if (!uniqueIds.has(competition.compSlug)) {
        compList.push({
          id: competition.compSlug,
        });
        uniqueIds.add(competition.compSlug);
      }
    })
  );
  update(compList);
}

logger.success("Started");
