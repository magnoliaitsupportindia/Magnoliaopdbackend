import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(employee)
    private employeeRepository: Repository<employee>,
  ) {}
  async addEmployee(data, signData) {
    let email = data['email']; 
    // let empId = data['empId'];
    if (email) {
      let empEmail = await this.employeeRepository.findOne({ email: email,company:signData.company });
      if (!empEmail) {
        // if (empId) {
        //   let employeeid = await this.employeeRepository.findOne({
        //     empId: empId,
        //   });
          if (!empEmail) {
            let userData = {
              empId: data.empId,
              firstName: data.firstName,
              lastName: data.lastName != null ? data.lastName : '',
              email: data.email,
              mobile: data.contactNum,
              dob: data.dob != null ? data.dob : null,
              bloodGroup: data.bloodgrp != null ? data.bloodgrp : "NA",
              department: data.department,
              designation: data.designation,
              company: signData.company,
              gender: data.gender,
              emergencyMobile:
                data.emergencyNum != null ? data.emergencyNum : null,
              location: data.address != null ? data.address : '',
              createdBy: signData.createdBy,
              employeeType: data.employeeType,
              vendorId: data.vendorId != null ? data.vendorId : null,
            };
            let saveData = await this.employeeRepository.save(userData);
            if (saveData) {
              return { status: true, message: 'employee created Successffuly' };
            } else {
              return { status: false, message: 'Something went wrong' };
            }
          } else {
            return { status: false, message: 'Employee ID already exist' };
          }
        // } else {
        //   return { status: false, message: 'Employee id is empty' };
        // }
      } else {
        return { status: false, message: 'Given Email Adresss already Exist for an employee' };
      }
    } else {
      return { status: false, message: 'Error in creating user' };
    }
  }

  async getAllEmployee(companyDetail) {
    let allEmployee = await getManager().query(`
    SELECT e.id,e.empId, e.firstName as firstname,e.lastName as lastname,e.mobile,c.companyName as company,d.departmentName as department FROM employee e
    join company c on c.id=e.company 
    join departmentmaster d on d.id=e.department 
    where e.deletedAt is null and e.company=${companyDetail} and employeeType=1 ORDER BY e.createdAt DESC;
    `);
    return allEmployee;
    // return await this.employeeRepository.find({
    //   select: ['id', 'firstname','lastname', 'dob','emergencyMobile','location', 'bloodGroup', 'mobile','department' ,'empId', 'company', 'createdAt'],
    // });
  }

  async getAllNonEmployee(companyDetail) {
    let allEmployee = await getManager().query(`
    SELECT e.id,e.empId,v.vendorName, e.firstName as firstname,e.lastName as lastname,e.mobile,c.companyName as company,d.departmentName as department FROM employee e
    join company c on c.id=e.company 
    join departmentmaster d on d.id=e.department 
    left join vendormaster v on e.vendorId = v.id 
    where e.deletedAt is null and e.company=${companyDetail} and employeeType=2 ORDER BY e.createdAt DESC;
    `);
    return allEmployee;
    // return await this.employeeRepository.find({
    //   select: ['id', 'firstname','lastname', 'dob','emergencyMobile','location', 'bloodGroup', 'mobile','department' ,'empId', 'company', 'createdAt'],
    // });
  }

  async signUpData(company) {
    let companyDetail = await getManager().query(
      `SELECT id,companyName as company FROM company where deletedAt is null and id=${company};`,
    );
    let designation = await getManager().query(
      `SELECT id, designationName as designation FROM designationmaster where deletedAt is null and companyId = ${company};`,
    );
    let department = await getManager().query(
      `SELECT id,departmentName as department FROM departmentmaster where deletedAt is null and companyId=${company};`,
    );
    let employeeType = await getManager().query(
      `Select id, employeeType from companyemployeetypemapping where deletedAt is null and companyId=${company};`,
    );
    let vendors = await getManager().query(
      `select id,vendorName from vendormaster where deletedAt is null and companyId=${company}; `,
    );
    let overallData = {
      company: companyDetail,
      department: department,
      designation: designation,
      employeeType: employeeType,
      vendor: vendors,
    };
    return overallData;
  }

  async getEmployeeById(id) {
    let allEmployeebyId = await getManager().query(
      `
    SELECT e.id,e.empId, e.firstName,e.lastName,e.email,e.bloodGroup,e.gender,
    e.location,e.dob,e.mobile,e.emergencyMobile,c.companyName as company,d.id as depId,c.id as cId,
    d.departmentName as department,dm.designationName as designation,dm.id as descId FROM employee e
    join company c on c.id=e.company 
    join designationmaster dm on dm.id =e.designation
    join departmentmaster d on d.id=e.department where e.deletedAt is null and employeeType=1 and e.id=?;`,
      [id],
    );
    return allEmployeebyId;
  }

  async getNonEmployeeById(id) {
    let allEmployeebyId = await getManager().query(
      `
      SELECT e.id,e.empId, e.firstName,e.lastName,e.email,e.bloodGroup,e.gender,
      e.location,e.dob,e.mobile,e.emergencyMobile,c.companyName as company,
      d.id as depId,c.id as cId,d.departmentName as department,
      dm.designationName as designation,dm.id as descId,vm.vendorName as vendorname,
      vm.id as vendorId FROM employee e join company c on c.id=e.company 
      join designationmaster dm on dm.id =e.designation
      left join vendormaster vm on vm.id = e.vendorId
      join departmentmaster d on d.id=e.department where e.deletedAt is null and e.employeeType=2 and e.id=?;`,
      [id],
    );
    return allEmployeebyId;
  }

  async deleteEmployee(id, user) {
    // let soft = await this.employeeRepository.softDelete({ id: id });
    // if (soft.raw.affectedRows) {
    let soft = await this.employeeRepository.update(
      { id: id },
      { deletedAt: new Date(), deletedBy: user },
    );
    return soft;
    // }
  }
  async editEmployeeDetails(data, id, user,company) {
    await this.employeeRepository.update(
      { id: id },
      {
        empId: data.empId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.contactNum,
        dob: data.dob != null ? data.dob : null,
        bloodGroup: data.bloodgrp,
        department: data.department,
        designation: data.designation,
        company:company,
        gender: data.gender,
        emergencyMobile: data.emergencyNum != null ? data.emergencyNum : '',
        location: data.address != null ? data.address : '',
        updatedBy: user,
        updatedAt: new Date(),
        vendorId: data.vendorId != null ? data.vendorId : null,
      },
    );
    return { success: true };
  }
  async empIdGen() {
    let allEmployee = await getManager().query(
      `select count(*) as lengethOfEmpID from employee;`,
    );
    return allEmployee;
  }
  async bulkUpload(temp) {
    let saveData = await this.employeeRepository.save(temp);
    if (saveData) {
      return { status: true, message: 'Employeeslist Upload Successffuly' };
    } else {
      return { status: false, message: 'Error Employees Upload' };
    }
  }

  async getalldesc(comId) {
    let alldesc = await getManager().query(
      `select id,designationName from designationmaster where deletedAt is null and companyId=${comId};`,
    );
    return alldesc;
  }

  async getalldept(comId) {
    let alldesc = await getManager().query(
      `select id,departmentName from departmentmaster where deletedAt is null and companyId=${comId};`,
    );
    return alldesc;
  }

  async getallVendor(comId) {
    let alldesc = await getManager().query(
      `select id,vendorName from vendormaster where deletedAt is null and companyId=${comId};`,
    );
    return alldesc;
  }

  // async getallcomp(comId) {
  //   // let alldesc = await getManager().query(
  //   //   `select id,companyName from company where deletedAt is null and companyId=${comId};`,
  //   // );
  //   // return alldesc;
  // }

  async getAllEmail(comId) {
    let alldesc = await getManager().query(
      `select email from employee where deletedAt is null and company=${comId};`,
    );
    return alldesc;
  }
  async getEmpByDept(id,company){
    let employeeDept= await getManager().query(`
    select id,firstName,lastName from employee where department =${id} and company= ${company} and deletedAt is null`)
    return employeeDept;
  }
}
