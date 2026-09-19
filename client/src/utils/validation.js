/**
 * Check validation and return message
 * @param {Object} form name of the package
 * @param {Array} requireFields type of the script
 */
export const validateForm = (form, requireFields) => {
  const errors = [];

  for (let i in requireFields) {
    const field = requireFields[i];
    const formValue = form[field.param];

    if (field.type === "object") {
      if (
        !formValue ||
        !formValue[field.value] ||
        !formValue[field.value].toString().trim().length
      ) {
        errors.push({
          param: field.param,
          msg: field.msg,
        });
      }
    } else if (field.type === "array") {
      if (!Array.isArray(formValue) || formValue.length === 0) {
        errors.push({
          param: field.param,
          msg: field.msg,
        });
      }
    } else if (field.type === "number") {
      if (formValue === undefined || formValue === null || isNaN(formValue)) {
        errors.push({
          param: field.param,
          msg: field.msg,
        });
      }
    } else if (field.cond) {
      const trimData = field.value?.toString().trim() || "";
      if (!field.cond(trimData)) {
        errors.push({
          param: field.actualParam || field.param,
          msg: field.msg,
        });
      }
    } else {
      const stringValue = formValue?.toString() || "";
      if (!stringValue.trim().length) {
        errors.push({
          param: field.actualParam || field.param,
          msg: field.msg,
        });
      }
    }
  }

  return errors.length ? errors : [];
};
