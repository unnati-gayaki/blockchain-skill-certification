const certIds = [];

function addCertId(certId) {
  if (!certIds.includes(certId)) {
    certIds.push(certId);
  }
}

function getAllCertIds() {
  return certIds;
}

module.exports = {
  addCertId,
  getAllCertIds
};
