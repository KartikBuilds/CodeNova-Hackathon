exports.validate = (body, requiredFields) => {
  for (let field of requiredFields) {
    if (!body[field]) return false;
  }
  return true;
};
