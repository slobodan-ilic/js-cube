const nj = require("numjs");
const jsc = require("../src/cube");
const cat_x_cat = require("./fixtures/cat-x-cat.json");
const mr_x_cat = require("./fixtures/mr-x-cat-hs.json");
const DT = require('../src/dimensionTypes.constants')
const Dimension = require('../src/dimension')
const catXCatCube = new jsc.JsCube(cat_x_cat);
const mrXCatCube = new jsc.JsCube(mr_x_cat);

describe("Dimension", () => {
  it("resolves to CAT type", () => {
    let dimension = new Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.CAT);
  });

  it("resolves to MR type", () => {
    let dimension = new Dimension(mr_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.MR);
  });

  it("resolves to MR_CAT type", () => {
    let dimension = new Dimension(mr_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.MR);
  });

  it("knows its valid indexes", () => {
    let dimension = new Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.validIndices).toEqual([0, 1]);
  });
});