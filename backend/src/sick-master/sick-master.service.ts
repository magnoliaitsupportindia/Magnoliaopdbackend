import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSickMasterDto } from './dto/create-sick-master.dto';
import { UpdateSickMasterDto } from './dto/update-sick-master.dto';
import { SickMaster } from './entities/sick-master.entity';

@Injectable()
export class SickMasterService {
  constructor(
    @InjectRepository(SickMaster)
    private SickMasterRepository: Repository<SickMaster>,
  ) {}
  async check(data,company){
    let checkSick=await this.SickMasterRepository.findOne({sickName: data.sickName,companyId:company})
    return checkSick;
  }
  async addSick(data,user,company) {
    let userData = {
      sickName: data.sickName,
      createdBy:user,
      companyId:company
    };

    let saveData = await this.SickMasterRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Sick created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }

  async getAllSick(company) {
    let data = await this.SickMasterRepository
      .createQueryBuilder('m')
      .select(['id','sickName','createdAt'])
      .where(`companyId=${company}`)
      .orderBy('createdAt', 'DESC')
      .execute();
    return data;
  }
  
  async getSickById(id) {
    return await this.SickMasterRepository.findOne({
      select: ['id', 'sickName'],
      where: {
        id: id,
      },
    });
  }
  async deleteSick(id,user) {
    let soft = await this.SickMasterRepository.update(
      { id: id }, 
      { deletedAt: new Date(),deletedBy:user });
    return soft;
  }
  async editSickDetails(data,id,user) {
    let edit = await this.SickMasterRepository.update(
      { id: id },
      {
        sickName: data.sickName,
        updatedBy:user
      },
    );
    return edit;
  }

  async bulkUpload(temp){
   let upload=await this.SickMasterRepository.save(temp) 
  }
}
