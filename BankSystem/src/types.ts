import { v4 as uuidv4 } from "uuid";// for unique id always

export const ACCOUNT_TYPES = {
    SAVINGS: "savings",
    CURRENT: "current",
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

export const TRANSACTION_TYPES = {
    DEPOSIT: "deposit",
    WITHDRAW: "withdraw",
    TRANSFER: "transfer",
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export interface Transaction {
    id: string;
    type: "deposit" | "withdraw" | "transfer";
    amount: number;
    description?: string;
    timestamp: string;
    balanceAfter: number;
}

export interface Account {
    accountNumber: string;
    customerName: string;
    accountType: AccountType;
    balance: number;
    isActive: boolean;
    createdAt: string;
    transactions: Transaction[];
}
// Active account type (for type guard)
export type ActiveAccount = Account & { isActive: true };

// Input type for creating account
export interface CreateAccountInput {
    customerName: string;
    accountType: AccountType;
    initialDeposit: number;
}

// Safe account (without transactions) for output
export type SafeAccount = Omit<Account, "transactions">;