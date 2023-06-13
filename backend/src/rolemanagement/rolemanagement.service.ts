import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolemanagementDto } from './dto/create-rolemanagement.dto';
import { UpdateRolemanagementDto } from './dto/update-rolemanagement.dto';
import { Rolemanagement } from './entities/rolemanagement.entity';

@Injectable()
export class RolemanagementService {
  constructor(
    @InjectRepository(Rolemanagement)
    private RolemanagementRepository: Repository<Rolemanagement>,
  ) {}

  async check(data,signData){
    let roleCheck= await this.RolemanagementRepository.findOne({roleName:data.roleName,companyId:signData.company})
    return roleCheck ;
  }

  async addRole(data,signData) {
    let userData = {
      roleName: data.roleName,
      createdBy:signData.createdBy,
      companyId:signData.company
    };  
    let saveData = await this.RolemanagementRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Role created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }


  async getAllRole(companyDetail) {
    const data = await this.RolemanagementRepository
      .createQueryBuilder('m')
      .select([
        'id','roleName','createdAt',
      ])
      .where(`companyId=${companyDetail}`)
      .orderBy('createdAt', 'DESC')
      .execute();
    return data;
  }

  async getRoleById(id) {
    return await this.RolemanagementRepository.findOne({
      select: ['id', 'roleName'],
      where: {
        id: id,
      },
    });
  }
  async deleteRole(id,signData) {
    // soft delete work only single changes in api
    // let soft = await this.RolemanagementRepository.softDelete({ id: id });
    // if (soft.raw.affectedRows) {
     let soft= await this.RolemanagementRepository.update(
        { id: id },
        {
        deletedBy:signData.deletedBy,
        deletedAt: new Date()
      },
      );
    // }
    return soft;
  }
  async editRoleDetails(data,id,detail) {
    await this.RolemanagementRepository.update(
      { id: id },
      {
        roleName: data.roleName,
        updatedBy:detail,
        updatedAt:new Date()
      },
    );
    return { success: true };
  }

  async bulkUpload(temp){
    let upload = await this.RolemanagementRepository.save(temp)
    return upload;
  }
}
