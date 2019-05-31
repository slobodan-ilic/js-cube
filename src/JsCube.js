var nj = require('numjs');

const dimensionTypes = Object.freeze({
  CAT: "CAT",
  MR: "MR",
  MR_CAT: "MR_CAT"
});

const dt = dimensionTypes

class Dimension {
  constructor(dimDict) {
    this.dimDict = dimDict;
  }

  get type() {
    return this.resolveType;
  }

  get elements() {
    if (this.type == dt.MR_CAT || this.type == dt.CAT) {
      return this.dimDict.type.categories;
    }
    if (this.type === dt.MR) {
      return this.dimDict.type.elements;
    }
  }

  get validIndices() {
    return this.elements
      .map((e, i) => (!e.missing ? i : -1))
      .filter(i => i !== -1);
  }

  get resolveCategorical() {
    if (this.isArrayCat) {
      return dt.MR_CAT;
    }
    return dt.CAT
  }

  get isArrayCat() {
    return Boolean(this.dimDict.references.subreferences)
  }
  get resolveType() {
    let dimDict = this.dimDict;
    let typeClass = dimDict.type.class;

    if (typeClass === 'categorical') {

      return this.resolveCategorical;
    }

    if (typeClass === 'enum') {
      let subclass = dimDict.type.subtype.class;
      if (subclass === 'variable') {
        // TODO: Add proper array type resolution here
        return dt.MR;
      }
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

  get allDimensionTypes() {
    return this.dimensions.map(dim => dim.type);
  }

  get dimensionTypes() {
    return this.allDimensionTypes.filter(t => t !== dt.MR_CAT)
  }

  get slices() {
    return this.getSlices();
  }

  get shape() {
    return this.dimensions.map(d => d.elements.length);
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
