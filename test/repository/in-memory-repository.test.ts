import { Employee } from "@/entities/employee";
import { InMemoryEmployeeRepository } from "@/repository/in-memory-employee-repository";

function getSut() {
  const employees: Employee[] = [];
  const repository = new InMemoryEmployeeRepository(employees);
  return {
    repository,
  };
}

describe("Tests InMemoryEmployeeRepository", () => {
  it("should persist a new Employee", async () => {
    const { repository } = getSut();
    const newEmployee = Employee.create({
      name: "employee test",
      email: "employeetest@test.com",
      type: "employee",
    }).value as Employee;
    await repository.save(newEmployee);
    const employeeFromRepository = await repository.findEmployeeByEmail(
      newEmployee.email
    );
    expect(employeeFromRepository.email).toBe(newEmployee.email);
  });

  it("should not be able to insert same Employee two times", async () => {
    const { repository } = getSut();
    const newEmployee = Employee.create({
      name: "employee test",
      email: "employeetest@test.com",
      type: "employee",
    }).value as Employee;
    await repository.save(newEmployee);
    const saveSecondTimeError = (await repository.save(newEmployee))
      .value as Error;
    expect(saveSecondTimeError.name).toBe("DuplicatedEmailError");
    expect(saveSecondTimeError.message).toBe("Este e-mail já está cadastrado!");
  });

  it("should return null if email not exist", async () => {
    const { repository } = getSut();
    const emailNotExists = "notexistemail@test.com";
    const nullResult = await repository.findEmployeeByEmail(emailNotExists);
    expect(nullResult).toBeNull();
  });

  it("should return a list of Employees", async () => {
    const { repository } = getSut();
    const newEmployee1 = Employee.create({
      name: "employee test",
      email: "employeetest1@test.com",
      type: "employee",
    }).value as Employee;
    const newEmployee2 = Employee.create({
      name: "employee test",
      email: "employeetest2@test.com",
      type: "employee",
    }).value as Employee;
    const newEmployee3 = Employee.create({
      name: "employee test",
      email: "employeetest3@test.com",
      type: "employee",
    }).value as Employee;
    await repository.save(newEmployee1);
    await repository.save(newEmployee2);
    await repository.save(newEmployee3);
    const employees = await repository.findAll();
    expect(employees.length).toBe(3);
    expect(employees[2].email).toBe(newEmployee3.email);
  });
});
