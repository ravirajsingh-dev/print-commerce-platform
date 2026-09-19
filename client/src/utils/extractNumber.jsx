export default (intlNumber, intlCode) => {
  if (intlNumber && intlCode) {
    const ICL = intlCode.length;
    const pos = intlNumber.indexOf(intlCode);
    if (pos !== -1) {
      return intlNumber.substr(ICL);
    }
  }
  return intlNumber || "";
};
