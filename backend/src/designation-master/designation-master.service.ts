import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateDesignationMasterDto } from './dto/create-designation-master.dto';
import { UpdateDesignationMasterDto } from './dto/update-designation-master.dto';
import { DesignationMaster } from './entities/designation-master.entity';

@Injectable()
export class DesignationMasterService {
  constructor(
    @InjectRepository(DesignationMaster)
    private DesignationMasterRepository: Repository<DesignationMaster>,
  ) {}
  async check(data,company){
    let check=await this.DesignationMasterRepository.findOne({ designationName: data.designationName,companyId:company})
    return check;
  }
  async addDesignation(data,user,company) {
    let userData = {
      designationName: data.designationName,
      createdBy:user,
      companyId:company
    };
    let saveData = await this.DesignationMasterRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Designation created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }
  async getAllDesignation(company) {
    let alldesc = await getManager().query(`
    select d.id, d.designationName,count(e.designation)as count,d.createdAt as createdAt 
    from designationmaster d
    left join employee e on e.designation = d.id where d.deletedAt is null and e.deletedAt is null and d.companyId=${company} group by d.id ORDER BY d.createdAt DESC;
    `);
    return alldesc;
  }
  async getDesignationById(id) {
    return await this.DesignationMasterRepository.findOne({
      select: ['id', 'designationName'],
      where: {
        id: id,
      },
    });
  }
  async deleteDesignation(id,user) {
    // let soft = await this.DesignationMasterRepository.softDelete({ id: id });
    // if (soft.raw.affectedRows) {
      let soft = await this.DesignationMasterRepository.update(
        { id: id },
        { deletedAt: new Date(),
          deletedBy:user },
      );
    // }
    return soft;
  }
  async editDesignationDetails(data,id,user) {
   let update= await this.DesignationMasterRepository.update(
      { id: id },
      {
        designationName: data.designationName,
        updatedBy:user
      },
    );
    return update;
  }

  async bulkUpload(temp){
    let upload=await this.DesignationMasterRepository.save(temp)
    return upload;
  }
}
