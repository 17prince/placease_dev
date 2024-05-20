class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Filter
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "page", "limit", "field"];
    excludedFields.forEach((ele) => delete queryObj[ele]);

    // Advance Searching
    const queryStr = JSON.stringify(queryObj).replace(
      /\bgt|gte|lt|lte\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2. Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      // Default sorting
      this.query = this.query.sort("enrollment");
    }

    return this;
  }

  // 3. Limiting Fields
  limitFields() {
    if (this.queryString.field) {
      const fields = this.queryString.field.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // 4. Pagination
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;

    // Documents to skip
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); // page 1 : 1-10, page 2 : 11-20, page 3 : 21-30

    return this;
  }
}

module.exports = APIFeature;
