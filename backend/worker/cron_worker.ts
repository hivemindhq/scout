import { CronInput } from "../@types/cron";
import logger from "../lib/logger";
import axios from "axios";

export default async function update(comps: CronInput[]) {
  comps.forEach(async (cron: CronInput) => {
    logger.warn(`Updating: ${cron.id}`);
    const request = await axios.get(
      `https://api.ftcscout.org/rest/v1/events/2023/${cron.id}/teams`
    );
    const response = await request.data.json();

    console.log(response);
  });
}
