/**
 * @jest-environment node
 * @group smoke
 */
import { clipToOffshore } from "./clipToOceanOffshore";
import { clipToPolygonPreprocessorSmokeTest } from "../util/genClipToPolygonPreprocessorSmokeTest";

clipToPolygonPreprocessorSmokeTest(clipToOffshore, "clipToOceanOffshore");
