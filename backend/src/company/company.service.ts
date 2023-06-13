import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { cityList, Company, stateList, typeOfEnterprises } from './entities/company.entity';
import { companyEmployeeTypeMapping } from './entities/company.entity';
import { getManager, Repository } from 'typeorm';
import { CommunicationService } from 'src/communication';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private CompanyRepository: Repository<Company>,

    @InjectRepository(typeOfEnterprises)
    private industryTypeRepository: Repository<typeOfEnterprises>,

    @InjectRepository(stateList)
    private StateRepository: Repository<stateList>,

    @InjectRepository(cityList)
    private cityRepository: Repository<cityList>,

    @InjectRepository(companyEmployeeTypeMapping)
    private CompanyEmployeeTypeMappingRepository: Repository<companyEmployeeTypeMapping>,

    private communicationService: CommunicationService,

  ) {}
  async addCompany(data, signData,file) {
    if (file) {
      let uploadedFile = await this.communicationService.uploadPublicFile(
        file.buffer,
        Date.now()+'_'+file.originalname.replace(/ /g,''),
        file.mimetype
      );
    let userData = {
      companyName: data.companyName,
      enterpriseEmail:data.enterpriseEmail,
      mobile:data.mobile,
      websiteUrl:data.websiteUrl ? data.websiteUrl :"",
      enterprisesType:data.enterprisesType,
      state:data.state,
      city:data.city,
      address:data.address,
      createdBy: signData.createdBy,
      logoUrl:uploadedFile.key
    };  
    let saveData = await this.CompanyRepository.save(userData);
    // let saveData= 'a for aplle'
    if (saveData) {
      return { status: true, message: 'company created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }
  }
  async getAllCompany(user) {
    let allEmployee = await getManager().query(`
    select c.id,c.companyName,c.mobile,c.enterpriseEmail as email,te.enterpriseType from company c
    left join typeofenterprises te on te.id = c.enterprisesType where c.deletedAt is null order by c.createdAt desc;
    `);
    return allEmployee;
  }
  async getCompanyById(id) {
    return await this.CompanyRepository.findOne({
      select: ['id', 'companyName'],
      where: {
        id: id,
      },
    });
  }
  async deleteCompany(id, user) {
    // let soft = await this.CompanyRepository.softDelete({ id: id });
    // if (soft.raw.affectedRows) {
    let soft = await this.CompanyRepository.update(
      { id: id },
      {
        deletedBy: user,
        deletedAt: new Date()
      });
    // }
    return soft;
  }

  async editCompanyDetails(data, id, user) {
    await this.CompanyRepository.update(
      { id: id },
      {
        companyName: data.companyName,
        updatedAt: new Date(),
        updatedBy: user
      },
    );
    return { success: true };
  }

  async addEmployeeType(loadData) {
    let addEmpType = await this.CompanyEmployeeTypeMappingRepository.save(loadData)
    return addEmpType;
  }

  async addState(stateAdd) {
    let addState = await this.StateRepository.save(stateAdd)
    return addState;
  }

  async addCity(cityAdd) {
    let addCity = await this.cityRepository.save(cityAdd)
    return addCity;
  }

  async addenterpriseType(entAdd) {
    let addCity = await this.industryTypeRepository.save(entAdd)
    return addCity;
  }

  async signUpData(){
    let state = await getManager().query(`Select id,state from statelist where deletedAt is null`)
    let industryType = await getManager().query(`select id,enterpriseType from typeofenterprises where deletedAt is null`)
    return {state,industryType}
  }

  async getCityByState(id){
    let city = await getManager().query(`
    select id,city from citylist where state =${id}`)
    return city ;
  }
  async getCompanyLogo(id){
    let url = await getManager().query(`select logoUrl from company where id=${id}`)
    let key = url[0].logoUrl.toString();
    let getImageLogo = await this.communicationService.getAttachmentImage(key)
    return getImageLogo;
  }
}
