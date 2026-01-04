const certIds = [];

module.exports.addCertId = (certId) => {
  if (!certIds.includes(certId)) {
    certIds.push(certId);
  }
};

module.exports.getCertIds = () => {
  return certIds;
};
