package assignment4;

import java.io.*;
import java.util.*;

class invalidAmountException extends Exception {
    public InvalidAmountException(String msg) {
        super(msg);
    }
}

class invalidCIDException extends Exception {
    public InvalidCIDException(String msg) {
        super(msg);
    }
}

class insufficientBalanceException extends Exception {
    public InsufficientBalanceException(String msg) {
        super(msg);
    }
}

class Customer {
    int cid;
    String cname;
    double amount;

    Customer(int cid, String cname, double amount) {
        this.cid = cid;
        this.cname = cname;
        this.amount = amount;
    }

    void display() {
        System.out.println(cid + " " + cname + " " + amount);
    }
}

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {
            System.out.println("Enter Customer ID (1-20):");
            int cid = sc.nextInt();

            if (cid < 1 || cid > 20) {
                throw new invalidCIDException("CID of the employee must be between 1 and 20");
            }

            System.out.println("Enter Customer Name:");
            String cname = sc.next();

            System.out.println("Enter Amount:");
            double amount = sc.nextDouble();

            if (amount < 1000) {
                throw new invalidAmountException("Minimum amount should be 1000 in acc");
            }

            Customer c = new Customer(cid, cname, amount);

            System.out.println("Enter withdrawal amount:");
            double w = sc.nextDouble();

            if (w > amount) {
                throw new insufficientBalanceException("Insufficient balance in acc");
            }

            if (w < 0) {
                throw new invalidAmountException("Amount should always be positive");
            }

            amount = amount - w;

            // File writing
            FileWriter fw = new FileWriter("customer.txt", true);
            fw.write(cid + " " + cname + " " + amount + "\n");
            fw.close();

            System.out.println("Record stored successfully!");

        } catch (invalidCIDException | invalidAmountException | insufficientBalanceException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (IOException e) {
            System.out.println("File Error");
        } finally {
            System.out.println("Program Ended");
        }

        sc.close();
    }
}
