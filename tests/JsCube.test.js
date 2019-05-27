const nj = require('numjs');
const jsc = require('../src/JsCube');
const cat_x_cat = require('./fixtures/cat-x-cat.json');
const DT = jsc.dimensionTypes;
const catXCatCube = new jsc.JsCube(cat_x_cat);

describe('JsCube', () => {
  it('loads response JSON', () => {
    expect(catXCatCube.result.counts).toEqual([
      5,
      3,
      2,
      0,
      5,
      2,
      3,
      0,
      0,
      0,
      0,
      0,
    ]);
  });

  it('resolves CAT x CAT types', () => {
    expect(catXCatCube.dimensionTypes).toEqual([
      jsc.dimensionTypes.CAT,
      jsc.dimensionTypes.CAT,
    ]);
  });

  it('knows its shape with all elements', () => {
    expect(catXCatCube.shape).toEqual([3, 4]);
  });

  it('reshapes counts', () => {
    console.log(catXCatCube.counts);
    expect(catXCatCube.counts).toEqual(
      nj.array([[5, 3, 2, 0], [5, 2, 3, 0], [0, 0, 0, 0]]),
    );
  });
});

describe('Dimension', () => {
  it('resolves to CAT type', () => {
    let dimension = new jsc.Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.type).toEqual(DT.CAT);
  });

  it('knows its valid indexes', () => {
    let dimension = new jsc.Dimension(cat_x_cat.result.dimensions[0]);
    expect(dimension.validIndices).toEqual([0, 1]);
  });
});

describe.skip('CatXCatMatrix', () => {
  it('calculates column margin', () => {
    let matrix = new jsc.JsCube(cat_x_cat).slices[0];
    expect(matrix.columnMargin).toEqual([1, 2, 3]);
  });
});
