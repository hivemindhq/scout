import { CronInput } from "./@types/cron";
import { prisma } from "./lib/db.ts";
import logger from "./lib/logger.ts";
import * as cron from "node-cron";
import update from "./worker/cron_worker.ts";

const compList: CronInput[] = [];

cron.schedule("* * * * *", () => {
  update(compList);
});

async function addInitialComps() {
  const comps = await prisma.competition
    .findMany()
    .then(async (competitions) => {
      competitions.forEach(async (competition) => {
        if (competition.id == null) {
          return false;
        }

        if (competition.currentlyUsed) {
          await compList.push({
            id: competition.compSlug,
          });
        }
      });
    });
}

addInitialComps();

logger.success("Started");
