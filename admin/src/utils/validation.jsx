/**
 * Check validation and return massage
 * @param {Object} form name of the package
 * @param {ArrayObject} requireFields type of the script
 */
export const validateForm = (form, requireFields) => {
  const errors = [];
  for (let i in requireFields) {
    if (requireFields[i].type === "object") {
      if (!form[requireFields[i].param][requireFields[i].value].trim().length) {
        errors.push({
          param: requireFields[i].param,
          msg: requireFields[i].msg,
        });
      }
    } else if (requireFields[i].type === "array") {
      if (!form[requireFields[i].param].length) {
        errors.push({
          param: requireFields[i].param,
          msg: requireFields[i].msg,
        });
      }
    } else if (requireFields[i].type === "number") {
      if (isNaN(form[requireFields[i].param])) {
        errors.push({
          param: requireFields[i].param,
          msg: requireFields[i].msg,
        });
      }
    } else if (requireFields[i].cond) {
      const trimData = requireFields[i].value.trim();
      if (!requireFields[i].cond(trimData)) {
        errors.push({
          param: requireFields[i].actualParam || requireFields[i].param,
          msg: requireFields[i].msg,
        });
      }
    } else if (
      form[requireFields[i].param] === undefined ||
      form[requireFields[i].param] === null ||
      !form[requireFields[i].param].toString().trim().length
    ) {
      errors.push({
        param: requireFields[i].actualParam || requireFields[i].param,
        msg: requireFields[i].msg,
      });
    }
  }
  if (errors.length) {
    return errors;
  }
  return errors;
};
