const dt = require('./dimensionTypes.constants');

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
    return dt.CAT;
  }

  get isArrayCat() {
    return Boolean(this.dimDict.references.subreferences);
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

module.exports = Dimension;
