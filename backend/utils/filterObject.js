// Filter the object according to the given fields
const filterObject = (objectToFilter, ...fieldsToFilter) => {
  // @param : objectToFilter = it is the object which is to be filtered
  // @param : fieldsToFilter = Fields name, that need not to be removed
  const newObj = {};
  Object.keys(objectToFilter).forEach((field) => {
    if (fieldsToFilter.includes(field)) newObj[field] = objectToFilter[field];
  });

  return newObj;
};
exports.filterObject = filterObject;
