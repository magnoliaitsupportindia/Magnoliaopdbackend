import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncidentMasterDto } from './dto/create-incident-master.dto';
import { UpdateIncidentMasterDto } from './dto/update-incident-master.dto';
import { IncidentMaster } from './entities/incident-master.entity';

@Injectable()
export class IncidentMasterService {
  constructor(
    @InjectRepository(IncidentMaster)
    private IncidentMasterRepository: Repository<IncidentMaster>,
  ) {}

  async check(incidentname,company){
    let exists=await this.IncidentMasterRepository.findOne({incidentName:incidentname,companyId:company})
    return exists;
  }
  
  async addIncident(data,user,company) {
   let userData = {
      incidentName: data.incidentName,
      createdBy:user,
      companyId:company
    };
    let saveData = await this.IncidentMasterRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Incident created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }

   
  

  async getAllIncident(company) {
    const data = await this.IncidentMasterRepository
      .createQueryBuilder('m')
      .select(['id','incidentName','createdAt'])
      .where(`companyId=${company}`)
      .orderBy('createdAt', 'DESC')
      .execute();
    return data;
  }
  
  async getIncidentById(id) {
    return await this.IncidentMasterRepository.findOne({
      select: ['id', 'incidentName'],
      where: {
        id: id,
      },
    });
  }


  async deleteIncident(id,user) {
    let soft = await this.IncidentMasterRepository.update(
        { id: id },
        { deletedAt: new Date() ,
           deletedBy:user},
      );
    return soft;
  }


  async editIncidentDetails(data,id,user) {
   let edit= await this.IncidentMasterRepository.update(
      { id: id },
      {
        incidentName: data.incidentName,
        updatedBy:user
      },
    );
    return edit;
  }

  async bulkUpload(temp){
    let upload=await this.IncidentMasterRepository.save(temp)
    return upload ;
  }
}
