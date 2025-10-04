export const updateWalletBalance = async (wallet, amount, type) => {
  if (type === "DEPOSIT") {
    wallet.balance += amount;
  } else if (type === "WITHDRAW" || type === "PAYMENT") {
    if (wallet.balance < amount) throw new Error("Insufficient balance");
    wallet.balance -= amount;
  }
  await wallet.save();
  return wallet;
};
