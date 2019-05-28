var nj = require('numjs');

const dimensionTypes = Object.freeze({
  CAT: 0,
  MR: 1,
});

class Dimension {
  constructor(dimDict) {
    this.dimDict = dimDict;
  }

  get type() {
    return this.getType();
  }

  get categories() {
    return this.dimDict.type.categories;
  }

  get validIndices() {
    return this.categories
      .map((e, i) => (!e.missing ? i : -1))
      .filter(i => i !== -1);
  }

  getType() {
    let typeClass = this.dimDict.type.class;
    if (typeClass === 'categorical') {
      return dimensionTypes.CAT;
    }
  }
}

class JsCube {
  constructor(response) {
    this.result = response.result;
  }

  get allCounts() {
    return nj.array(this.result.counts).reshape(this.shape);
  }

  get counts() {
    let validIndices = this.dimensions.map(d => d.validIndices);
    let counts = this.allCounts;

    // Eliminate missing columns
    counts = nj.stack(validIndices[1].map(i => counts.T.pick(i, null)));
    // Eliminate missing rows
    counts = nj.stack(validIndices[0].map(i => counts.T.pick(i, null)));

    return counts;
  }

  get dimensions() {
    return this.result.dimensions.map(dimDict => new Dimension(dimDict));
  }

  get dimensionTypes() {
    return this.dimensions.map(dim => dim.type);
  }

  get slices() {
    return this.getSlices();
  }

  get shape() {
    return this.dimensions.map(d => d.categories.length);
  }

  getSlices() {
    if (this.dimensions.length === 2) {
      return [new CatXCatMatrix(this.dimensions, this.counts)];
    } else {
      // TODO: Index correct counts
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

module.exports = {
  JsCube: JsCube,
  dimensionTypes: dimensionTypes,
  Dimension: Dimension,
};
