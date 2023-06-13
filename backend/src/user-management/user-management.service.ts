import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateUserManagementDto } from './dto/create-user-management.dto';
import { UpdateUserManagementDto } from './dto/update-user-management.dto';
import { UserManagement } from './entities/user-management.entity';
import * as bcrypt from 'bcryptjs';
import { Company } from 'src/company/entities/company.entity';
import { Rolemanagement } from 'src/rolemanagement/entities/rolemanagement.entity';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(UserManagement)
    private userRepository: Repository<UserManagement>,
  ) {}

  async signUpData(company){
    let Company = await getManager().query(`SELECT id,companyName as company FROM company where deletedAt is null and id=${company};`);
    let role = await getManager().query(`SELECT id,roleName as role FROM rolemanagement where deletedAt is null and id !=1`);
    let overallData={"company":Company,"role":role}
    return overallData ;
  };

  async adminSignUpData(){
    let Company = await getManager().query(`SELECT id,companyName as company FROM company where deletedAt is null;`);
    let role = await getManager().query(`SELECT id,roleName as role FROM rolemanagement where deletedAt is null and id !=1`);
    let overallData={"company":Company,"role":role}
    return overallData ;
  };

  async addUser(data,company,user) {
    let Email = data['email'];
    if (Email) {
      let userEmail = await this.userRepository.findOne({ email: Email,company:data.company ? data.company : company });
      if (!userEmail) {
        let hashedPassword = await bcrypt.hash(data['password'], 10);
        let userData = {
          empId: data.empId,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: hashedPassword,
          address: data.address,
          company: data.company ? data.company : company,
          role: data.role,
          createdBy:user
        };
        let saveData = this.userRepository.save(userData);
        if (saveData) {
          return { status: true, message: 'User created Successffuly' };
        } else {
          return { status: false, message: 'Something went wrong' };
        }
      } else {
        return { status: false, message: 'Email Id already Exist' };
      }
    } else {
      return { status: false, message: 'Error in creating user' };
    } 
  }

  async getAllUser(company) {
    let allEmp = await getManager().query(
      `select u.id,u.empId, u.name,u.email,r.rolename as role from usermanagement u
       join company c on u.company=c.id
       join rolemanagement r on u.role = r.id where u.deletedAt is null and u.company=${company} ORDER BY u.createdAt DESC;`,
    );
    return allEmp ;
    // return await this.userRepository.find({
    //   select: ['id', 'name', 'email', 'mobile', 'address', 'company', 'role'],
    // });
  }

  async getAllAdminUser(){
    let allEmp = await getManager().query(
      `select u.id,u.empId, u.name,u.email,r.rolename as role,c.companyName from usermanagement u
       join company c on u.company=c.id
       join rolemanagement r on u.role = r.id where u.deletedAt is null and u.role = 2 ORDER BY u.createdAt DESC;`,
    );
    return allEmp ;
  }

  async getUserById(id) {
    let allEmp = await getManager().query(
      `select u.id,u.empId, u.name,u.email,u.mobile,u.address,u.company as compId,u.role as roleId,c.companyName as company ,r.rolename as role from usermanagement u
       join company c on u.company=c.id
       join rolemanagement r on u.role = r.id where u.id=?;`,[id]
    );
    return allEmp;
    
    // return await this.userRepository.findOne({
    //   select: ['id', 'name', 'email', 'mobile', 'address', 'company', 'role'],
    //   where: {
    //     id: id,
    //   },
    // });
  }

  async deleteUserById(id) {
    let soft = await this.userRepository.softDelete({ id: id });
    if (soft.raw.affectedRows) {
      await this.userRepository.update({ id: id }, { deletedAt: Date });
    }
    return { success: true };
  }

  async editUserDetails(data, id) {
    await this.userRepository.update(
      { id: id },
      {
        empId: data.empId,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        // password:hashedPassword,
        address: data.address,
        company: data.company,
        role: data.role,
      },
    );
    return { success: true };
  }
  async bulkUpload(temp):Promise<any> {
    return this.userRepository.save(temp); 
}

async getAllRole(companyId){
  let role= await getManager().query(`
  select roleName from rolemanagement where deletedAt is null and companyId=${companyId}`)
  return role;
}
}





  // async login(logindata){
  //   let email=logindata["email"];
  //   let user = await this.userRepository.findOne({ email:email })
  //   if(!user){
  //     return{status:false,message:"Email Or password is Invalid"}
  //   }else{
  //     let userLogin = await getManager().query(
  //       `select u.id, u.name as name,u.email, c.companyName as company ,r.id as roleId,r.rolename as role from usermanagement u
  //        join company c on u.company=c.id
  //        join rolemanagement r on u.role = r.id  where u.id=?;`,[user.id]
  //     );
  //     if(userLogin){
  //       let password= await bcrypt.compare(
  //         logindata["password"],
  //         user.password
  //       ); 
  //       if(password){
  //         let payload={
  //           id:userLogin[0].id,
  //           email:userLogin[0].email,
  //           role:userLogin[0].role,
  //         };
  //         let accessToken=this.jwtService.sign(payload);
  //         return{
  //           status: true,
  //           message: "Login Successfully",
  //           data:{
  //           token:accessToken,
  //           company:userLogin[0].company,
  //           name:userLogin[0].name,
  //           roleId:userLogin[0].roleId,
  //           role:userLogin[0].role
  //         }
  //         }
        
  //       }else{
  //         return{
  //           status:false, message:"Email Or password is Invalid"
  //         }
  //       }
  //     }else{
  //       return{status:false, message:"Email Or password is Invalid"}
  //     }
  //   }
  // };