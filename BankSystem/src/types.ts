export interface Transaction {
    id: string;
    type: "deposit" | "withdraw" | "transfer";
    amount: number;
    description?: string;
    timestamp: Date;
    balanceAfter: number;
}

export interface Account {
    accountNumber: string;
    customerName: string;
    accountType: "savings" | "current";
    balance: number;
    isActive: boolean;
    createdAt: Date;
    transactions: Transaction[];
}
