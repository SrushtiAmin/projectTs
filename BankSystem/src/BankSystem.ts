import { Account, Transaction } from "./types";

export class BankSystem {
    private accounts: Account[] = [];
    private lastAccountNumber = 0;


    // CREATE ACCOUNT (async + validation)

    async createAccount(
        customerName: string,
        accountType: "savings" | "current",
        initialDeposit: number
    ): Promise<Account> {

        // Validations
        if (!customerName || customerName.trim().length === 0) {
            throw new Error("Customer name is required.");
        }

        if (accountType !== "savings" && accountType !== "current") {
            throw new Error("Account type must be 'savings' or 'current'.");
        }

        if (initialDeposit < 0) {
            throw new Error("Initial deposit cannot be negative.");
        }

        const newAccount: Account = {
            accountNumber: (++this.lastAccountNumber).toString(),
            customerName,
            accountType,
            balance: initialDeposit,
            isActive: true,
            createdAt: new Date(),
            transactions: []
        };

        // Simulate async DB call
        await new Promise((resolve) => setTimeout(resolve, 10));

        this.accounts.push(newAccount);

        return newAccount;
    }


    // DELETE ACCOUNT (async + validation)

    async deleteAccount(accountNumber: string) {
        const account = this.accounts.find(acc => acc.accountNumber === accountNumber);

        if (!account) {
            throw new Error("Account not found.");
        }

        if (!account.isActive) {
            throw new Error("Account already deleted.");
        }

        // Simulate async DB call
        await new Promise((resolve) => setTimeout(resolve, 10));

        account.isActive = false;

        return { message: "Account deleted successfully." };
    }


    // SEARCH ACCOUNT BY NUMBER

    async getAccountByNumber(accountNumber: string) {
        await new Promise((res) => setTimeout(res, 10));

        const acc = this.accounts.find(a => a.accountNumber === accountNumber);

        if (!acc) throw new Error("Account not found.");
        if (!acc.isActive) throw new Error("Account is deactivated.");

        return acc;
    }

    // SEARCH ACCOUNT BY CUSTOMER NAME

    async getAccountsByCustomerName(customerName: string) {
        if (!customerName || customerName.trim().length === 0) {
            throw new Error("Customer name is required for search.");
        }

        await new Promise((res) => setTimeout(res, 10));

        const nameLower = customerName.toLowerCase();

        const result = this.accounts.filter(
            acc => acc.customerName.toLowerCase().includes(nameLower) && acc.isActive
        );

        if (result.length === 0) {
            throw new Error("No active accounts found for this name.");
        }

        return result;
    }


    // TRANSFER MONEY BETWEEN ACCOUNTS

    async transferMoney(
        fromAccNumber: string,
        toAccNumber: string,
        amount: number
    ) {
        // Basic validations
        if (amount <= 0) throw new Error("Transfer amount must be greater than 0.");

        const fromAcc = await this.getAccountByNumber(fromAccNumber);
        const toAcc = await this.getAccountByNumber(toAccNumber);

        if (fromAcc.accountNumber === toAcc.accountNumber) {
            throw new Error("Cannot transfer to the same account.");
        }

        if (fromAcc.balance < amount) {
            throw new Error("Insufficient balance for transfer.");
        }

        // Simulate async DB call
        await new Promise((res) => setTimeout(res, 10));

        // Deduct and add balance
        fromAcc.balance -= amount;
        toAcc.balance += amount;

        // Record transaction for sender
        const senderTxn: Transaction = {
            id: `TXN-${Date.now()}-S`,
            type: "transfer",
            amount: amount,
            description: `Transferred to account ${toAccNumber}`,
            timestamp: new Date(),
            balanceAfter: fromAcc.balance
        };
        fromAcc.transactions.push(senderTxn);

        // Record transaction for receiver
        const receiverTxn: Transaction = {
            id: `TXN-${Date.now()}-R`,
            type: "transfer",
            amount: amount,
            description: `Received from account ${fromAccNumber}`,
            timestamp: new Date(),
            balanceAfter: toAcc.balance
        };
        toAcc.transactions.push(receiverTxn);

        return {
            message: "Transfer successful.",
            fromAccountBalance: fromAcc.balance,
            toAccountBalance: toAcc.balance
        };
    }

    // DEPOSIT FUNDS

    async deposit(accountNumber: string, amount: number, description = "Deposit") {
        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than 0.");
        }

        const account = await this.getAccountByNumber(accountNumber);

        // Simulate async DB call
        await new Promise(res => setTimeout(res, 10));

        account.balance += amount;

        // Record transaction
        account.transactions.push({
            id: `TXN-${Date.now()}-D`,
            type: "deposit",
            amount,
            description,
            timestamp: new Date(),
            balanceAfter: account.balance
        });

        return {
            message: "Deposit successful.",
            balance: account.balance
        };
    }


    // WITHDRAW FUNDS

    async withdraw(accountNumber: string, amount: number, description = "Withdrawal") {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be greater than 0.");
        }

        const account = await this.getAccountByNumber(accountNumber);

        if (account.balance < amount) {
            throw new Error("Insufficient balance for withdrawal.");
        }

        // Simulate async DB call
        await new Promise(res => setTimeout(res, 10));

        account.balance -= amount;

        // Record transaction
        account.transactions.push({
            id: `TXN-${Date.now()}-W`,
            type: "withdraw",
            amount,
            description,
            timestamp: new Date(),
            balanceAfter: account.balance
        });

        return {
            message: "Withdrawal successful.",
            balance: account.balance
        };
    }
}
