/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToOffshore } from "./clipToOceanOffshore";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToOffshore, handler.options.title, {
  timeout: 20000,
});
