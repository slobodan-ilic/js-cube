const nj = require('numjs');
const jsc = require('../src/JsCube');
const dt = jsc.dimensionTypes;
const cat_x_cat = require('./fixtures/cat-x-cat.json');
const mr_x_cat = require('./fixtures/mr-x-cat-hs.json');
const DT = jsc.dimensionTypes;
const catXCatCube = new jsc.JsCube(cat_x_cat);
const mrXCatCube = new jsc.JsCube(mr_x_cat);

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

  describe('resolves cube type', () => {
    it('to CAT x CAT', () => {
      expect(catXCatCube.dimensionTypes).toEqual([dt.CAT, dt.CAT]);
    });

    // TODO: Add proper resolution (with mr cat hidden)
    it('to MR x MR_CAT x CAT', () => {
      expect(mrXCatCube.dimensionTypes).toEqual([dt.MR, dt.CAT, dt.CAT]);
    });
  });

  describe('knows its shape with all elements', () => {
    it('for CAT x CAT', () => {
      expect(catXCatCube.shape).toEqual([3, 4]);
    });

    fit('for MR x CAT', () => {
      expect(mrXCatCube.shape).toEqual([5, 3, 9]);
    });
  });

  it('reshapes all counts', () => {
    expect(catXCatCube.allCounts).toEqual(
      nj.array([[5, 3, 2, 0], [5, 2, 3, 0], [0, 0, 0, 0]]),
    );
  });

  it('indexes valid counts', () => {
    let actual = catXCatCube.counts;
    let expected = nj.array([[5, 2], [5, 3]]);
    expect(actual).toEqual(expected);
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

describe('CatXCatMatrix', () => {
  it('calculates column margin', () => {
    let matrix = new jsc.JsCube(cat_x_cat).slices[0];
    expect(matrix.columnMargin).toEqual(nj.array([10, 5]));
  });

  it('calculates row margin', () => {
    let matrix = new jsc.JsCube(cat_x_cat).slices[0];
    expect(matrix.rowMargin).toEqual(nj.array([7, 8]));
  });

  it('calculates column proportions', () => {
    let matrix = new jsc.JsCube(cat_x_cat).slices[0];
    expect(matrix.columnProportions).toEqual(
      nj.array([[0.5, 0.5], [0.4, 0.6]]),
    );
  });
});
