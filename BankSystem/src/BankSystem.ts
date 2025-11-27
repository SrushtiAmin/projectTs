import {
    Account,
    ActiveAccount,
    CreateAccountInput,
    SafeAccount,
    Transaction,
    TransactionType,
    ACCOUNT_TYPES,
    TRANSACTION_TYPES,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export class BankSystem {
    private accounts: Account[] = [];

    // TYPE GUARD – Ensure account is active
    private ensureActive(acc: Account): ActiveAccount {
        if (!acc.isActive) throw new Error("Account is deactivated.");
        return acc as ActiveAccount;
    }

    
    // CREATE ACCOUNT
    
    async createAccount(input: CreateAccountInput): Promise<SafeAccount> {
        const { customerName, accountType, initialDeposit } = input;

        if (!customerName || !customerName.trim()) throw new Error("Customer name is required.");
        if (!Object.values(ACCOUNT_TYPES).includes(accountType))
            throw new Error(`Account type must be one of: ${Object.values(ACCOUNT_TYPES).join(", ")}`);
        if (isNaN(initialDeposit) || initialDeposit < 0)
            throw new Error("Initial deposit must be a non-negative number.");

        const account: Account = {
            accountNumber: uuidv4(),
            customerName: customerName.trim(),
            accountType,
            balance: initialDeposit,
            isActive: true,
            createdAt: new Date(),
            transactions: [],
        };

        await this.simulateDelay();
        this.accounts.push(account);

        return this.sanitizeAccount(account);
    }

    
    // GET ACCOUNT BY NUMBER
    
    async getAccountByNumber(accNo: string): Promise<ActiveAccount> {
        if (!accNo) throw new Error("Account number is required.");

        await this.simulateDelay();
        const acc = this.accounts.find(a => a.accountNumber === accNo);
        if (!acc) throw new Error("Account not found.");

        return this.ensureActive(acc);
    }

 
    // SEARCH BY CUSTOMER NAME
    
    async getAccountsByCustomerName(name: string): Promise<SafeAccount[]> {
        if (!name || !name.trim()) throw new Error("Customer name is required.");

        await this.simulateDelay();
        const search = name.toLowerCase();
        const found = this.accounts
            .filter(acc => acc.customerName.toLowerCase().includes(search) && acc.isActive)
            .map(acc => this.sanitizeAccount(acc));

        if (found.length === 0) throw new Error("No active accounts found with this name.");

        return found;
    }
    // DEPOSIT
    
    async deposit(accNo: string, amount: number, description = "Deposit") {
        if (isNaN(amount) || amount <= 0) throw new Error("Deposit amount must be greater than 0.");

        const acc = await this.getAccountByNumber(accNo);

        await this.simulateDelay();
        acc.balance = parseFloat((acc.balance + amount).toFixed(2)); // Fix floating point
        this.recordTransaction(acc, TRANSACTION_TYPES.DEPOSIT, amount, description);

        return { message: "Deposit successful.", balance: acc.balance };
    }

  
    // WITHDRAW
    
    async withdraw(accNo: string, amount: number, description = "Withdrawal") {
        if (isNaN(amount) || amount <= 0) throw new Error("Withdrawal amount must be greater than 0.");

        const acc = await this.getAccountByNumber(accNo);
        if (acc.balance < amount) throw new Error("Insufficient balance.");

        await this.simulateDelay();
        acc.balance = parseFloat((acc.balance - amount).toFixed(2));
        this.recordTransaction(acc, TRANSACTION_TYPES.WITHDRAW, amount, description);

        return { message: "Withdrawal successful.", balance: acc.balance };
    }

    
    // TRANSFER
   
    async transfer(from: string, to: string, amount: number) {
        if (from === to) throw new Error("Cannot transfer to the same account.");
        if (isNaN(amount) || amount <= 0) throw new Error("Transfer amount must be greater than 0.");

        const fromAcc = await this.getAccountByNumber(from);
        const toAcc = await this.getAccountByNumber(to);

        if (fromAcc.balance < amount) throw new Error("Insufficient balance for transfer.");

        await this.simulateDelay();

        fromAcc.balance = parseFloat((fromAcc.balance - amount).toFixed(2));
        toAcc.balance = parseFloat((toAcc.balance + amount).toFixed(2));

        this.recordTransaction(fromAcc, TRANSACTION_TYPES.TRANSFER, amount, `Transferred to ${to}`);
        this.recordTransaction(toAcc, TRANSACTION_TYPES.TRANSFER, amount, `Received from ${from}`);

        return { message: "Transfer successful.", fromBalance: fromAcc.balance, toBalance: toAcc.balance };
    }

    
    // DELETE ACCOUNT (Soft Delete)
   
    async deleteAccount(accNo: string) {
        const acc = await this.getAccountByNumber(accNo);

        await this.simulateDelay();

        // Mark account as inactive
        (acc as Account).isActive = false;

        return { message: "Account successfully deleted." };
    }

    
    // HELPERS
   
    private recordTransaction(acc: ActiveAccount, type: TransactionType, amount: number, description: string) {
        const txn: Transaction = {
            id: `TXN-${uuidv4()}`,
            type,
            amount,
            description,
            timestamp: new Date(),
            balanceAfter: acc.balance,
        };
        acc.transactions.push(txn);
    }

    private sanitizeAccount(acc: Account): SafeAccount {
        const { transactions, ...safe } = acc;
        return safe;
    }

    private async simulateDelay() {
        return new Promise(res => setTimeout(res, 10));
    }
}
