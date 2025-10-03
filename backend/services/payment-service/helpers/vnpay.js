// helpers/vnpay.js
const qs = require("qs");
const crypto = require("crypto");

// Hàm sort object theo alphabet ASC
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .filter((k) => k.startsWith("vnp_")) // chỉ lấy param vnp_
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

function createSecureHash(secretKey, signData) {
  return crypto.createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");
}

function verifyVNPay(vnp_Params, secureHash, secretKey) {
  // Clone params và bỏ các field không cần
  const params = { ...vnp_Params };
  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];
  delete params["userId"]; // không phải param của VNPay

  // Sort theo alphabet ASC
  const sortedParams = sortObject(params);

  // Build query string
  const signData = qs.stringify(sortedParams, { encode: false });

  // Hash bằng SHA512
  const signature = createSecureHash(secretKey, signData);

  return {
    valid: signature === secureHash,
    signData,
    signature
  };
}

module.exports = {
  verifyVNPay,
  createSecureHash,
};
