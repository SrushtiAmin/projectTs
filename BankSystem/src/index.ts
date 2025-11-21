import { BankSystem } from "./BankSystem";

async function run() {
    const bank = new BankSystem();

    try {
       
        // CREATE ACCOUNTS
     
        console.log("=== CREATE ACCOUNTS ===");
        const acc1 = await bank.createAccount("John Doe", "savings", 1500);
        const acc2 = await bank.createAccount("Jane Smith", "current", 2000);
        console.log("Created:", acc1);
        console.log("Created:", acc2);

       
        // DEPOSIT
      
        console.log("\n=== DEPOSIT ===");
        const depositResult = await bank.deposit(acc1.accountNumber, 500, "Monthly savings");
        console.log(depositResult);

        // WITHDRAW
      
        console.log("\n=== WITHDRAW ===");
        const withdrawResult = await bank.withdraw(acc2.accountNumber, 300, "ATM withdrawal");
        console.log(withdrawResult);

     
        // SEARCH ACCOUNTS
    
        console.log("\n=== SEARCH BY ACCOUNT NUMBER ===");
        const searchByNumber = await bank.getAccountByNumber(acc1.accountNumber);
        console.log(searchByNumber);

        console.log("\n=== SEARCH BY CUSTOMER NAME ===");
        const searchByName = await bank.getAccountsByCustomerName("Jane");
        console.log(searchByName);


        // TRANSFER MONEY
   
        console.log("\n=== TRANSFER MONEY ===");
        const transferResult = await bank.transferMoney(acc1.accountNumber, acc2.accountNumber, 500);
        console.log(transferResult);


        // DELETE ACCOUNT
  
        console.log("\n=== DELETE ACCOUNT ===");
        const deleteResult = await bank.deleteAccount(acc1.accountNumber);
        console.log(deleteResult);

     
        // TRY SEARCH DELETED ACCOUNT (validation)

        console.log("\n=== SEARCH DELETED ACCOUNT ===");
        await bank.getAccountByNumber(acc1.accountNumber);

    } catch (err: any) {
        console.error("Error:", err.message);
    }
}

run();
