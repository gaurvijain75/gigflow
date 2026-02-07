package java_assignment2;

import java.util.Scanner;

class Employee {
    protected double salary;

    Employee(double salary) {
        this.salary = salary;
    }

    void displaySalary() {
        System.out.println(salary);
    }
}

class FullTimeEmployee extends Employee {

    FullTimeEmployee(double salary) {
        super(salary);
    }

    void calculateSalary() {
        System.out.print("Salary before hike: ");
        displaySalary();

        salary = salary + (salary * 0.50);

        System.out.print("Salary after 50% hike: ");
        displaySalary();
    }
}

class InternEmployee extends Employee {

    InternEmployee(double salary) {
        super(salary);
    }

    void calculateSalary() {
        System.out.print("Salary before hike: ");
        displaySalary();

        salary = salary + (salary * 0.25);

        System.out.print("Salary after 25% hike: ");
        displaySalary();
    }
}

public class HierarchicalInheritanceDemo {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Full Time Employee Salary: ");
        double ftSalary = sc.nextDouble();
        FullTimeEmployee fte = new FullTimeEmployee(ftSalary);
        fte.calculateSalary();

        System.out.print("Enter Intern Employee Salary: ");
        double intSalary = sc.nextDouble();
        InternEmployee intern = new InternEmployee(intSalary);
        intern.calculateSalary();

        sc.close();
    }
}
