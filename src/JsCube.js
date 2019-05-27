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

  get counts() {
    return nj.array(this.result.counts).reshape(this.shape);
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
  // this.getCounts = () => {};
  // this.counts = this.getCounts();
}

class CatXCatMatrix {
  constructor(dimensions, counts) {
    this.dimensions = dimensions;
    this.counts = counts;
  }

  get columnMargin() {
    return this.getColumnMargin();
  }

  getColumnMargin() {
    let counts = this.counts;
  }
}

module.exports = {
  JsCube: JsCube,
  dimensionTypes: dimensionTypes,
  Dimension: Dimension,
};
