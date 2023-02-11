/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToOuterOffshore } from "./clipToOceanOuterOffshore";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToOuterOffshore, handler.options.title, {
  timeout: 20000,
});
