export type AccountType = "savings" | "current";

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
