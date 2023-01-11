/**
 * @jest-environment node
 * @group smoke
 */
import { clipToNearshore } from "./clipToOceanNearshore";
import { clipToPolygonPreprocessorSmokeTest } from "../util/genClipToPolygonPreprocessorSmokeTest";

clipToPolygonPreprocessorSmokeTest(clipToNearshore, "clipToOceanNearshore");
