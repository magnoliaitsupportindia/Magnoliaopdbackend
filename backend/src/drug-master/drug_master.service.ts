import { Injectable } from '@nestjs/common';
import { DrugMaster } from './entities/drug_master.entity';
import { CreateDrugMasterDto } from './dto/create-drug_master.dto';
import { getManager, Repository } from 'typeorm';
import { UpdateDrugMasterDto } from './dto/update-drug_master.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DrugMasterService {
  constructor(
    @InjectRepository(DrugMaster)
    private DrugMasterRepository: Repository<DrugMaster>,
  ) {}
  async check(drug,company){
    let check=await this.DrugMasterRepository.findOne({drugName:drug,companyId:company})
    return check;
  }

  async addDrug(data,user,company) {
    let userData = {
      drugName: data.drugName,
      createdBy:user,
      companyId:company
    };
    let saveData = await this.DrugMasterRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Drug created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }

  async getAllDrug(company) {
    const data = await this.DrugMasterRepository
      .createQueryBuilder('m')
      .select(['id','drugName','createdAt'])
      .where(`companyId = ${company}`)
      .orderBy('createdAt', 'DESC')
      .execute();
    return data;
  }

  async getRequestDrug() {
    let allRequestDrug = await getManager()
    .query(`SELECT dm.requestid,dmm.requestdate,u.name,dmm.itemdescription,dmm.requestqty,a.approvalstatusname FROM magnoliaOPD.drugrequestmaster dm 
    join drugrequestmapping dmm on dm.id = dmm.requestid
    join approvalstatus a on dmm.statusid = a.id
    join usermanagement u on dm.requestby = u.id;`);
    return allRequestDrug;
  }

  async getDrugById(id) {
    return await this.DrugMasterRepository.findOne({
      select: ['id', 'drugName'],
      where: {
        id: id,
      },
    });
  }

  async deleteDrug(id,user) {
    // let soft = await this.DrugMasterRepository.softDelete({ id: id });
    // if (soft.raw.affectedRows) {
      let soft = await this.DrugMasterRepository.update(
        { id: id },
         { deletedAt: new Date(),
           deletedBy:user });
    // }
    return soft;
  }
  
  async editDrugDetails(data, id,user) {
   let update= await this.DrugMasterRepository.update(
      { id: id },
      {
        drugName: data.drugName,
        updatedBy:user
      },
    );
    return update;
  }

  async bulkUpload(temp){
    let upload = await this.DrugMasterRepository.save(temp)
    return upload;
  }
}
