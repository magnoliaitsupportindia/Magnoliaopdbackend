import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, IsNull, Repository } from 'typeorm';
import { CreateHospitalMasterDto } from './dto/create-hospital-master.dto';
import { UpdateHospitalMasterDto } from './dto/update-hospital-master.dto';
import { HospitalMaster } from './entities/hospital-master.entity';

@Injectable()
export class HospitalMasterService {
  constructor(
    @InjectRepository(HospitalMaster)
    private HospitalMasterRepository: Repository<HospitalMaster>,
  ) {}
  async check(data,company){
    let check = await this.HospitalMasterRepository.findOne({hospitalName: data.hospitalName,companyId:company})
    return check;
  }
  async addHospital(data,user,company) {
    let Data = {
      hospitalName: data.hospitalName,
      location: data.location,
      contact: data.contact,
      companyId:company,
      createdBy:user
    };
    let saveData = await this.HospitalMasterRepository.save(Data);
    if (saveData) {
      return { status: true, message: 'Hospital created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }


  async getAllHospital(company) {
    let data = await this.HospitalMasterRepository
      .createQueryBuilder()
      .select([ 'id','hospitalName','location','contact','createdAt'])
      .where(`companyId = ${company}`).andWhere(`deletedAt is null`)
      .orderBy('createdAt', 'DESC')
      .execute();
    // let data= await getManager().query(`
    // select id,hospitalName,contact,createdAt from hospitalmaster where companyId = ${company}`)
    return data;
  }

  async getHospitalById(id) {
    return await this.HospitalMasterRepository.findOne({
      select: ['id', 'hospitalName', 'location', 'contact'],
      where: {
        id: id,
      },
    });
  }
  async deleteHospital(id,user) {
      let soft = await this.HospitalMasterRepository.update(
        { id: id },
        { deletedAt: new Date(),deletedBy:user },
      );
    return soft;
  }
  async editHospitalDetails(data,id,user) {
   let edit= await this.HospitalMasterRepository.update(
      { id: id },
      {
        hospitalName: data.hospitalName,
        location: data.location,
        contact: data.contact,
        updatedBy:user
      },
    );
    return edit;
  }

  async getHospitalByDate(fDate,company) {
    return await getManager()
    .createQueryBuilder(HospitalMaster, "hospitalMaster")
    .select("hospitalMaster.id as id,hospitalMaster.hospitalName as hospitalName ,hospitalMaster.location as location ,hospitalMaster.contact as contact, hospitalMaster.createdAt as createdAt")
    .where("Date(hospitalMaster.createdAt) = Date(:date)", { date: fDate }) .andWhere(`companyId =${company} `)
    .orderBy('createdAt','DESC')
    .getRawMany();

  }

  async getAllHospitalWithLazyLoading(details) {
    if(details.filter && details.filter !== ''){
      const data = await this.HospitalMasterRepository
      .createQueryBuilder('m')
      .select([
        'id','hospitalName','location','contact','createdAt',
      ])
      .limit(details.rows) 
      .offset(details.offset)
      .where("hospitalName like :name", {name: `%${details.filter}%` })
      .orWhere("location like :name", {name: `%${details.filter}%`  })
      .orWhere("contact like :name", {name: `%${details.filter}%`  })
      .orWhere("createdAt like :name", {name: `%${details.filter}%` })
      .orderBy(details.sortField, details.sort)
      // .getQuery();
      .getRawMany();
    return data;
    }
    else{
      const data = await this.HospitalMasterRepository
      .createQueryBuilder('m')
      .select([
        'id','hospitalName','location','contact','createdAt',
      ])
      .limit(details.rows) 
      .offset(details.offset)
      .where('createdAt IS NOT NULL',{name: `%${details.filter}%` })
      .orderBy(details.sortField, details.sort)
      // .getQuery();
      .getRawMany();
    return data;
    }

  }

  async bulkUpload(temp){
  let upload=await this.HospitalMasterRepository.save(temp)
  return upload; 
  }
}
    // return await this.HospitalMasterRepository.findOne({
    //   select: ['id', 'hospitalName', 'location', 'contact'],
    //   where: {
    //     createdAt: date,
    //   },
    // });

    