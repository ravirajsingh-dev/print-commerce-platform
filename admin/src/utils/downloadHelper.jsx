export const downloadBase64File = (base64, fileName, type) => {
  // create file in browser
  const linkSource = `data:${type};base64,${base64}`;

  // create "a" HTLM element with href to file
  const link = document.createElement("a");
  link.href = linkSource;
  link.download = fileName;
  link.click();
};

export const openBase64File = (base64, fileTitle, fileType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: fileType });

  const fileURL = URL.createObjectURL(blob);

  window.open(fileURL, "_blank");

  URL.revokeObjectURL(fileURL);
};
