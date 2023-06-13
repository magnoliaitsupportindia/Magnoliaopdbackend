import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { DepartmentMaster } from './entities/department-master.entity';
import { CreateDepartmentMasterDto } from './dto/create-department-master.dto';
import { UpdateDepartmentMasterDto } from './dto/update-department-master.dto';
@Injectable()
export class DepartmentMasterService {
  constructor(
    @InjectRepository(DepartmentMaster)
    private DepartmentMasterRepository: Repository<DepartmentMaster>,
  ) {}
  async check(data,company){
    const check = await this.DepartmentMasterRepository.findOne({departmentName:data.departmentName,companyId:company})
    return check;
  }
  async addDepartment(data,user,company) {  
    let userData = {
      departmentName: data.departmentName,
      createdBy:user,
      companyId:company
    };
    let saveData = await this.DepartmentMasterRepository.save(userData);
      return saveData;
  }

  async getAllDepartment(companyId) {
    let allDepartment = await getManager().query(`
    select d.id, d.departmentName,count(e.department)as count,d.createdAt as createdAt 
    from departmentmaster d
    left join employee e on e.department = d.id where d.deletedAt is null and e.deletedAt is null and companyId=${companyId} group by d.id ORDER BY d.createdAt DESC;
    `);
    return allDepartment;
  }
  async getDepartmentById(id) {
    return await this.DepartmentMasterRepository.findOne({
      select: ['id', 'departmentName'],
      where: {
        id: id,
      },
    });
  }

  async deleteDepartment(id,user) {
    let soft = await this.DepartmentMasterRepository.update(
        { id: id },
        { deletedAt: new Date(),
          deletedBy:user },
      );
    return soft;
  }

  async editDepartmentById(data,id,user) {
   let update=await this.DepartmentMasterRepository.update(
      { id: id },
      {
        updatedBy:user,
        departmentName: data.departmentName,
      },
    );
    return update;
  }

  async bulkUpload(temp){
    let upload=await this.DepartmentMasterRepository.save(temp)
    // let upload='save'
    return upload;
  }
}



    // .createQueryBuilder()
    // .select(['departmentName'])
    // .where(`companyId=${companyId}`).andWhere( `departmentName =${data}`) .andWhere(`deletedAt is null`)
    // .execute();
  // return check;
    // let check=await getManager().query(`
    // select departmentName from departmentmaster where companyId = ${company} and departmentName =${data}`)