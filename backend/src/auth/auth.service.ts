import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserManagement } from '../user-management/entities/user-management.entity';
import { getManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserManagement)
        private userRepository: Repository<UserManagement>,
        private jwtService: JwtService
    ) {}

    async login(logindata){
        let email=logindata["email"];
        let user = await this.userRepository.findOne({ email:email })
        if(!user){
          return{status:false,message:"Username or Password is Invalid"}
        }else{
          let userLogin = await getManager().query(
            `select u.id, u.name as name,u.email,c.id as companyId ,c.companyName as company ,r.id as roleId,r.rolename as role from usermanagement u
             join company c on u.company=c.id
             join rolemanagement r on u.role = r.id  where u.id=?;`,[user.id]
          );
          if(userLogin){
            let password= await bcrypt.compare(logindata["password"],user.password); 
            if(password){
              let payload={
                id:userLogin[0].id,
                email:userLogin[0].email,
                role:userLogin[0].roleId,
                companyId:userLogin[0].companyId,
              };
              let accessToken=this.jwtService.sign(payload);
              return{
                status: true,
                message: "Login Successfully",
                data:{
                token:accessToken,
                company:userLogin[0].company,
                name:userLogin[0].name,
                roleId:userLogin[0].roleId,
                role:userLogin[0].role
              }
              }
            }
            else{
              return{
                status:false, message:"Invalid Username or Password"
              }
            }
          }else{
            return{status:false, message:"Invalid Username or Password"}
          }
        } 
      };


    async validateUser(signedUser) {
        // var userObj = await this.userRepository.findOne({ email: signedUser.email});
        var userObj=await getManager().query(`select * from usermanagement where id = ${signedUser.id}`)
        if (userObj) {
            return userObj;
        }
        return false;
      }
}
