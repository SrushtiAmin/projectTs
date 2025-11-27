import { Account, AccountType, Transaction } from "./types";

export class BankSystem {
    private accounts: Account[] = [];
    private lastAccountNumber = 1;

    // Generate Unique Transaction ID
    private generateTxnId() {
        return "TXN" + Math.floor(Math.random() * 1000000);
    }

    // Get account (active only)
    private getAccount(accNo: string): Account {
        const acc = this.accounts.find(a => a.accountNumber === accNo);
        if (!acc) throw new Error("Account not found");
        if (!acc.isActive) throw new Error("Account is inactive");
        return acc;
    }

    // ---------------------------
    // CREATE ACCOUNT
    // ---------------------------
    createAccount(customerName: string, type: AccountType, initialBalance = 0): Account {
        if (initialBalance < 0) throw new Error("Initial balance cannot be negative");

        const acc: Account = {
            accountNumber: String(this.lastAccountNumber++),
            customerName,
            accountType: type,
            balance: initialBalance,
            isActive: true,
            createdAt: new Date().toISOString(),
            transactions: []
        };

        if (initialBalance > 0) {
            const txn: Transaction = {
                id: this.generateTxnId(),
                type: "deposit",
                amount: initialBalance,
                description: "Initial deposit",
                timestamp: new Date().toISOString(),
                balanceAfter: initialBalance
            };
            acc.transactions.push(txn);
        }

        this.accounts.push(acc);
        return acc;
    }

    // ---------------------------
    // DEPOSIT
    // ---------------------------
    deposit(accNo: string, amount: number) {
        if (amount <= 0) throw new Error("Invalid amount");

        const acc = this.getAccount(accNo);
        acc.balance += amount;

        acc.transactions.push({
            id: this.generateTxnId(),
            type: "deposit",
            amount,
            description: "Amount deposited",
            timestamp: new Date().toISOString(),
            balanceAfter: acc.balance
        });

        return acc;
    }

    // ---------------------------
    // WITHDRAW
    // ---------------------------
    withdraw(accNo: string, amount: number) {
        if (amount <= 0) throw new Error("Invalid amount");

        const acc = this.getAccount(accNo);
        if (acc.balance < amount) throw new Error("Insufficient balance");

        acc.balance -= amount;

        acc.transactions.push({
            id: this.generateTxnId(),
            type: "withdraw",
            amount,
            description: "Amount withdrawn",
            timestamp: new Date().toISOString(),
            balanceAfter: acc.balance
        });

        return acc;
    }

    // ---------------------------
    // TRANSFER
    // ---------------------------
    transfer(fromAcc: string, toAcc: string, amount: number) {
        if (fromAcc === toAcc) throw new Error("Cannot transfer to same account");

        this.withdraw(fromAcc, amount);
        this.deposit(toAcc, amount);

        return { message: "Transfer successful" };
    }

    // ---------------------------
    // DELETE ACCOUNT (SOFT DELETE)
    // ---------------------------
    deleteAccount(accNo: string) {
        const acc = this.getAccount(accNo);
        acc.isActive = false;
        return { message: "Account deactivated" };
    }

    // ---------------------------
    // REACTIVATE ACCOUNT
    // ---------------------------
    reactivateAccount(accNo: string) {
        const acc = this.accounts.find(a => a.accountNumber === accNo);
        if (!acc) throw new Error("Account not found");

        acc.isActive = true;
        return { message: "Account reactivated", acc };
    }

    // ---------------------------
    // HARD DELETE ACCOUNT
    // ---------------------------
    closeAccountPermanently(accNo: string) {
        const index = this.accounts.findIndex(a => a.accountNumber === accNo);
        if (index === -1) throw new Error("Account not found");

        const removed = this.accounts.splice(index, 1);
        return { message: "Account permanently removed", removed };
    }

    // ---------------------------
    // UPDATE NAME
    // ---------------------------
    updateCustomerName(accNo: string, newName: string) {
        const acc = this.getAccount(accNo);
        acc.customerName = newName;
        return acc;
    }

    // ---------------------------
    // SEARCH
    // ---------------------------
    search(query: string) {
        return this.accounts.filter(
            a =>
                a.accountNumber === query ||
                a.customerName.toLowerCase().includes(query.toLowerCase())
        );
    }

    // ---------------------------
    // BALANCE
    // ---------------------------
    getBalance(accNo: string) {
        const acc = this.getAccount(accNo);
        return acc.balance;
    }

    // ---------------------------
    // TRANSACTIONS
    // ---------------------------
    getTransactionHistory(accNo: string) {
        const acc = this.getAccount(accNo);
        return acc.transactions;
    }

    // ---------------------------
    // LISTS
    // ---------------------------
    listAllAccounts() {
        return this.accounts;
    }

    listActiveAccounts() {
        return this.accounts.filter(a => a.isActive);
    }

    listInactiveAccounts() {
        return this.accounts.filter(a => !a.isActive);
    }
}
