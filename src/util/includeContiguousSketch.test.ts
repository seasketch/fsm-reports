/**
 * @jest-environment node
 * @group unit
 */

import { shouldIncludeContiguous } from "./includeContiguousSketch";
import { genSketch, genSketchCollection } from "./sketch";

describe("includeContiguous", () => {
  test.only("should be included only if valid yes attribute", async () => {
    const sketch = genSketch({ name: "test" });
    const coll = genSketchCollection([sketch], { name: "test" });
    expect(shouldIncludeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "foo",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(shouldIncludeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "No",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(shouldIncludeContiguous(coll)).toBe(false);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "Yes",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(shouldIncludeContiguous(coll)).toBe(true);

    coll.properties.userAttributes = [
      {
        fieldType: "ChoiceField",
        label: "Include 12-24 nm Contiguous Zone as No-Take?",
        value: "yes",
        exportId: "include_12-24_nm_contiguous_zone",
      },
    ];
    expect(shouldIncludeContiguous(coll)).toBe(true);
  });
});
