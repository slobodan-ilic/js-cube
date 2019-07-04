const nj = require('numjs');
const jsc = require('../src/cube');
const dt = jsc.dimensionTypes;
const cat_x_cat = require('./fixtures/cat-x-cat.json');
const mr_x_cat = require('./fixtures/mr-x-cat-hs.json');
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
    it('to MR x CAT', () => {
      expect(mrXCatCube.dimensionTypes).toEqual([dt.MR, dt.CAT]);
    });
  });

  describe('resolves all dimensions types', () => {
    it('to MR x MR_CAT x CAT', () => {
      expect(mrXCatCube.allDimensionTypes).toEqual([dt.MR, dt.MR_CAT, dt.CAT]);
    });
  });

  describe('knows its shape with all elements', () => {
    it('for CAT x CAT', () => {
      expect(catXCatCube.shape).toEqual([3, 4]);
    });

    it('for MR x CAT', () => {
      expect(mrXCatCube.shape).toEqual([5, 3, 9]);
    });
  });

  it('reshapes all counts', () => {
    expect(catXCatCube.allCounts).toEqual(
      nj.array([[5, 3, 2, 0], [5, 2, 3, 0], [0, 0, 0, 0]])
    );
  });

  it('indexes valid counts', () => {
    let actual = catXCatCube.counts;
    let expected = nj.array([[5, 2], [5, 3]]);
    expect(actual).toEqual(expected);
  });
});

describe('CatXCatMatrix', () => {
  it('has correct dimension types', () => {
    let cube = new jsc.JsCube(cat_x_cat);
    expect(cube.dimensionTypes).toEqual([dt.CAT, dt.CAT]);
  });

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
      nj.array([[0.5, 0.5], [0.4, 0.6]])
    );
  });
});

describe('MrXCatMatrix', () => {
  it('calculates column margin', () => {
    const expected = nj.array([
      [15, 24, 0, 57, 69, 0],
      [15, 34, 0, 75, 86, 0],
      [13, 37, 0, 81, 111, 0],
      [20, 50, 0, 159, 221, 0],
      [32, 69, 0, 167, 208, 0],
    ]);

    let matrix = new jsc.JsCube(mr_x_cat).slices[0];
    expect(matrix.columnMargin).toEqual(expected);
  });
});
