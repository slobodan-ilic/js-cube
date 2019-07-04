const cat_x_cat = require('./fixtures/cat-x-cat.json');
const mr_x_cat = require('./fixtures/mr-x-cat-hs.json');
const DT = require('../src/dimensionTypes.constants');
const Dimension = require('../src/dimension');

describe('First CAT x CAT Dimension', () => {
  it('resolves to CAT type', () => {
    let dimension = new Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.CAT);
  });

  it('resolves to MR type', () => {
    let dimension = new Dimension(mr_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.MR);
  });

  it('resolves to MR_CAT type', () => {
    let dimension = new Dimension(mr_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.MR);
  });

  it('knows its valid indexes', () => {
    let dimension = new Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.validIndices).toEqual([0, 1]);
  });
});

describe('Second CAT x CAT Dimension', () => {
  it('resolves to CAT type', () => {
    let dimension = new Dimension(cat_x_cat.result.dimensions[1]);
    expect(dimension.type).toEqual(DT.CAT);
  });
});
