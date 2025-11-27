export const ACCOUNT_TYPES = {
    SAVINGS: "savings",
    CURRENT: "current",
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

// -------------------------
// TRANSACTION TYPES
// -------------------------
export const TRANSACTION_TYPES = {
    DEPOSIT: "deposit",
    WITHDRAW: "withdraw",
    TRANSFER: "transfer",
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// -------------------------
// TRANSACTION INTERFACE
// -------------------------
export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description?: string;
    timestamp: Date;
    balanceAfter: number;
}

// -------------------------
// ACCOUNT INTERFACE
// -------------------------
export interface Account {
    accountNumber: string;
    customerName: string;
    accountType: AccountType;
    balance: number;
    isActive: boolean;
    createdAt: Date;
    transactions: Transaction[];
}

// ACTIVE ACCOUNT (type guard)
export interface ActiveAccount extends Account {
    isActive: true;
}

// SAFE ACCOUNT (hide transactions)
export type SafeAccount = Omit<Account, "transactions">;

// CREATE ACCOUNT INPUT
export interface CreateAccountInput {
    customerName: string;
    accountType: AccountType;
    initialDeposit: number;
}
