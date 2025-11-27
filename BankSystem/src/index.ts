import { BankSystem } from "./BankSystem";

const bank = new BankSystem();

// Create Accounts
const acc1 = bank.createAccount("John Doe", "savings", 1000);
const acc2 = bank.createAccount("Alice", "current", 500);

// Deposit
bank.deposit("1", 300);

// Withdraw
bank.withdraw("2", 200);

// Transfer
bank.transfer("1", "2", 500);

// Search
console.log("Search John:", bank.search("John"));
console.log("Search account 1:", bank.search("1"));

// Balance
console.log("Balance of 1:", bank.getBalance("1"));

// Transaction History
console.log("Transactions of 1:", bank.getTransactionHistory("1"));

// List Accounts
console.log("All accounts:", bank.listAllAccounts());
console.log("Active accounts:", bank.listActiveAccounts());

// Update Name
bank.updateCustomerName("1", "Johnathan Doe");

// Delete & Reactivate
bank.deleteAccount("2");
bank.reactivateAccount("2");

// Hard Delete (optional)
bank.closeAccountPermanently("2");
