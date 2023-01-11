/**
 * @jest-environment node
 * @group unit
 */

import {
  includeContiguous,
  isTrueAttributeValue,
} from "./includeVirtualSketch";
import {
  genSampleNullSketch,
  genSampleNullSketchCollection,
} from "@seasketch/geoprocessing";

describe("isTrueAttributeValue", () => {
  test("should return proper boolean", async () => {
    expect(isTrueAttributeValue(undefined)).toBe(false);
    expect(isTrueAttributeValue("No")).toBe(false);
    expect(isTrueAttributeValue(false)).toBe(false);
    expect(isTrueAttributeValue(true)).toBe(true);
    expect(isTrueAttributeValue("Yes")).toBe(true);
    expect(isTrueAttributeValue("yes")).toBe(true);
  });
});

describe("includeContiguous", () => {
  test.only("should be included only if valid yes attribute", async () => {
    const sketch = genSampleNullSketch("test");
    const coll = genSampleNullSketchCollection([sketch], "test");
    expect(includeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "foo",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(includeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "No",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(includeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "Yes",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(includeContiguous(coll)).toBe(true);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "yes",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(includeContiguous(coll)).toBe(true);
  });
});
