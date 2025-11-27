import { BankSystem } from "./BankSystem";
import { ACCOUNT_TYPES } from "./types";

async function main() {
    try {
        const bank = new BankSystem();

        // Create Accounts
        const acc1 = await bank.createAccount({
            customerName: "John Doe",
            accountType: ACCOUNT_TYPES.SAVINGS,
            initialDeposit: 1000,
        });

        const acc2 = await bank.createAccount({
            customerName: "Alice",
            accountType: ACCOUNT_TYPES.CURRENT,
            initialDeposit: 500,
        });

        console.log("Account 1:", acc1);
        console.log("Account 2:", acc2);

        // Store the UUIDs
        const acc1No = acc1.accountNumber;
        const acc2No = acc2.accountNumber;

        // Deposit
        const d = await bank.deposit(acc1No, 300);
        console.log("Deposit:", d);

        // Withdraw
        const w = await bank.withdraw(acc2No, 200);
        console.log("Withdraw:", w);

        // Transfer
        const t = await bank.transfer(acc1No, acc2No, 150);
        console.log("Transfer:", t);

        // Get account by number
        const found = await bank.getAccountByNumber(acc1No);
        console.log("Fetched Account:", found);

        // Search by name
        const search = await bank.getAccountsByCustomerName("John");
        console.log("Search Results:", search);

        // Delete account
        const del = await bank.deleteAccount(acc2No);
        console.log("Delete:", del);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("ERROR:", err.message);
        } else {
            console.error("Unknown Error:", err);
        }
    }
}

main();
