var nj = require('numjs');

const Dimension = require('./dimension');
const dt = require('./dimensionTypes.constants');

const _ = require('lodash');

class JsCube {
  constructor(response) {
    this.result = response.result;
  }

  get allCounts() {
    return nj.array(this.result.counts).reshape(this.shape);
  }

  get3dValids(arr3d, valids) {
    return arr3d
      .map(slc2d =>
        slc2d
          .map(slc1d => slc1d.filter((_, k) => valids[2].includes(k)))
          .filter((_, j) => valids[1].includes(j))
      )
      .filter((_, i) => valids[0].includes(i));
  }

  get2dValids(arr2d, valids) {
    return arr2d
      .map(slc1d => slc1d.filter((_, k) => valids[1].includes(k)))
      .filter((_, j) => valids[0].includes(j));
  }

  get counts() {
    let validIndices = this.dimensions.map(d => d.validIndices);
    let counts = this.allCounts.tolist();

    if (validIndices.length === 3) {
      return nj.array(this.get3dValids(counts, validIndices));
    }
    if (validIndices.length === 2) {
      return nj.array(this.get2dValids(counts, validIndices));
    }
  }

  get dimensions() {
    return this.result.dimensions.map(dimDict => new Dimension(dimDict));
  }

  get allDimensionTypes() {
    return this.dimensions.map(dim => dim.type);
  }

  get dimensionTypes() {
    var dtypes = this.allDimensionTypes.filter(t => t !== dt.MR_CAT);
    return dtypes;
  }

  get slices() {
    return this.getSlices();
  }

  get shape() {
    return this.dimensions.map(d => d.elements.length);
  }

  getSlices() {
    const dimensionTypes = this.dimensionTypes;
    if (_.isEqual(dimensionTypes, [dt.CAT, dt.CAT])) {
      return [new CatXCatMatrix(this.dimensions, this.counts)];
    } else if (_.isEqual(dimensionTypes, [dt.MR, dt.CAT])) {
      return [new MrXCatMatrix(this.dimensions, this.counts)];
    }
  }
}

class CategoricalVector {
  constructor(counts) {
    this.counts = counts;
  }

  get margin() {
    return nj.sum(this.counts);
  }

  get proportions() {
    return nj.stack(this.counts.map(count => count / this.margin));
  }
}

class MultipleResponseVector extends CategoricalVector {
  get margin() {
    return _.zip(this.selected, this.other).map(counts => _.sum(counts));
  }

  get selected() {
    return this.counts[0];
  }

  get other() {
    return this.counts[1];
  }
}

class CatXMrVector extends CategoricalVector {}

class CatXCatMatrix {
  constructor(dimensions, counts) {
    this.dimensions = dimensions;
    this.counts = counts;
  }

  get columnMargin() {
    return nj.stack(this.columns.map(column => column.margin));
  }

  get columnProportions() {
    return nj.stack(this.columns.map(column => column.proportions));
  }

  get rowMargin() {
    return nj.stack(this.rows.map(row => row.margin));
  }

  get rows() {
    let rowCounts = this.counts.tolist();
    return rowCounts.map(counts => new CategoricalVector(counts));
  }

  get columns() {
    let columnCounts = this.counts.T.tolist();
    return columnCounts.map(counts => new CategoricalVector(counts));
  }
}

class MrXCatMatrix extends CatXCatMatrix {
  get columns() {
    let columnCounts = this.counts.T.tolist();
    return columnCounts.map(counts => new MultipleResponseVector(counts));
  }

  get rows() {
    let rowCounts = this.counts.tolist();
    return rowCounts.map(counts => new CatXMrVector(counts[0]));
  }
  get columnMargin() {
    return nj.array(
      nj.stack(this.columns.map(column => column.margin)).T.tolist()
    );
  }

  get rowMargin() {
    return nj.array(this.rows.map(row => row.margin));
  }
}

module.exports = {
  JsCube: JsCube,
  dimensionTypes: dt,
};
