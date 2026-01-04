// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Certificate {

    struct CertData {
        string certId;
        string studentName;
        string courseName;
        string aiSkillLevel;
        bool aiMatch;
        uint256 issuedAt;
        address issuer;
    }

    mapping(string => CertData) public certificates;

    event CertificateIssued(
        string certId,
        string studentName,
        string courseName,
        string aiSkillLevel,
        bool aiMatch,
        uint256 issuedAt,
        address issuer
    );

    function issueCertificate(
    string memory certId,
    string memory studentName,
    string memory courseName,
    string memory aiSkillLevel,
    bool aiMatch
) public {
    require(bytes(certificates[certId].certId).length == 0, "Certificate already exists");

    certificates[certId] = CertData(
        certId,
        studentName,
        courseName,
        aiSkillLevel,
        aiMatch,
        block.timestamp,
        msg.sender
    );

    emit CertificateIssued(
        certId,
        studentName,
        courseName,
        aiSkillLevel,
        aiMatch,
        block.timestamp,
        msg.sender
    );
}

    function getCertificate(string memory _certId)
        public
        view
        returns (CertData memory)
    {
        return certificates[_certId];
    }
}
