import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository } from 'typeorm';
import { masterReportTail, moduleTable } from './entities/tali.entity';
import { subModule } from './entities/tali.entity';
import { screens } from './entities/tali.entity';

@Injectable()
export class TalisService {
  constructor(
    @InjectRepository(moduleTable)
    private moduleRepository: Repository<moduleTable>,
    @InjectRepository(subModule)
    private subModuleReb: Repository<subModule>,
    @InjectRepository(screens)
    private screens: Repository<screens>,
    @InjectRepository(masterReportTail)
    private masterTails: Repository<masterReportTail>,
  ) {}


  async GetAllTails() {
    const consoReport =   await this.moduleRepository
      .createQueryBuilder('m')
      .innerJoin(subModule, 'sm', 'sm.moduleId = m.id')
      .innerJoin(screens, 's', 's.subModuleId = sm.id')
      .select([
        'm.moduleName as modulename',
        's.screenName',
        's.displayName',
        's.iconName',
        's.url',
      ])
      .where(`s.ishoddisplay=0`)
      .execute();
    return consoReport;
  }
  async GetAllAdminTails() {
    const consoReport =   await this.moduleRepository
      .createQueryBuilder('m')
      .innerJoin(subModule, 'sm', 'sm.moduleId = m.id')
      .innerJoin(screens, 's', 's.subModuleId = sm.id')
      .select([
        'm.moduleName as modulename',
        's.screenName',
        's.displayName',
        's.iconName',
        's.url',
      ])
      .where(`s.ishoddisplay=1`)
      .execute();
    return consoReport;
  }


  async GetMasterTails() {
    return await this.masterTails.find({
      select: ['id', 'taileName', 'isActive','url'],
    });
  }









  // let consoReport= await getManager().query(`
    // select m.moduleName as modulename,s.screenName,s.displayName as s_displayName,s.iconName as s_iconName,s.url as s_url
    // from moduletable m
    // inner join submodule sm on sm.moduleId = m.id
    // inner join screens s on s.SubModuleId = sm.id where s.deletedAt is null;
    // `)


    
    // let consoReport=await getManager().query(`
    // select m.moduleName as modulename,s.screenName,s.displayName,s.iconName,s.url 
    // from moduletable m
    // inner join submodule sm on sm.moduleId = m.id
    // inner join screens s on s.SubModuleId = sm.id
    // where m.deletedAt is null;
    // `)
  // async GetAllTails() {
  //   const tt = this.moduleRepository.get;
  //   return tt;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} tali`;
  // }

  // update(id: number, updateTaliDto: UpdateTaliDto) {
  //   return `This action updates a #${id} tali`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tali`;
  // }
}
