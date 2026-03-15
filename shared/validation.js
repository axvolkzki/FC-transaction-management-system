export const VALID_STATUSES = ["Pending", "Settled", "Failed"];
export const ACCOUNT_NUMBER_REGEX = /^\d{4}-\d{4}-\d{4}$/;

export function validateTransaction(data) {
  const errors = [];
  const { transaction_date, account_number, account_holder_name, amount, status } = data;

  if (!transaction_date)    errors.push("Transaction date is required.");
  if (!account_number)      errors.push("Account number is required.");
  if (!account_holder_name) errors.push("Account holder name is required.");
  if (!amount)              errors.push("Amount is required.");
  if (!status)              errors.push("Status is required.");

  if (amount && (isNaN(amount) || parseFloat(amount) <= 0))
    errors.push("Amount must be a positive number.");

  if (status && !VALID_STATUSES.includes(status))
    errors.push("Invalid status. Must be: Pending, Settled, or Failed.");

  if (account_number && !ACCOUNT_NUMBER_REGEX.test(account_number))
    errors.push("Account number must be in format XXXX-XXXX-XXXX.");

  return errors;
}