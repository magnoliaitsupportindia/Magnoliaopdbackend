import { Injectable } from '@nestjs/common';
import { CreateVendorMasterDto } from './dto/create-vendor-master.dto';
import { UpdateVendorMasterDto } from './dto/update-vendor-master.dto';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorMaster } from './entities/vendor-master.entity';

@Injectable()
export class VendorMasterService {
  constructor(
    @InjectRepository(VendorMaster)
    private VendorMasterRepository: Repository<VendorMaster>,
  ) {}
  
  async check(data,company){
    let checkVendor=await this.VendorMasterRepository.findOne({vendorName: data.vendorName,companyId:company})
    return checkVendor;
  }
  async addVendor(data,company,user) {
    let userData = {
      vendorName: data.vendorName,
      purposeOfVendor: data.purposeOfVendor,
      createdBy:user,
      companyId:company
    };
    let saveData = await this.VendorMasterRepository.save(userData);
    if (saveData) {
      return { status: true, message: 'Contractor created Successffuly' };
    } else {
      return { status: false, message: 'Something went wrong' };
    }
  }

  async getAllVendor(company) {
    const data = await this.VendorMasterRepository
      .createQueryBuilder('m')
      .select(['id','vendorName','createdAt','purposeOfVendor'])
      .where(`companyId=${company}`)
      .orderBy('createdAt', 'DESC')
      .execute();
    return data;
  }

  async getVendorById(id) {
    return await this.VendorMasterRepository.findOne({
      select: ['id', 'vendorName', 'purposeOfVendor'],
      where: {
        id: id,
      },
    });
  }
  async deleteVendor(id,user) {
    let soft = await this.VendorMasterRepository.update(
      { id: id }, 
      { deletedAt: new Date(),deletedBy:user} );
    return soft;
  }
  async editVendor(data,id,user) {
    await this.VendorMasterRepository.update(
      { id: id },
      {
        vendorName: data.vendorName,
        purposeOfVendor: data.purposeOfVendor,
        updatedBy:user
      },
    );
    return { success: true };
  }

  async bulkUpload(temp){
    let upload=await this.VendorMasterRepository.save(temp)
    return upload;
  }
  // // purpose portion start
  // async addPurpose(data) {
  //   // eslint-disable-next-line prefer-const
  //   let userData = {
  //     purposeName: data.purposeName,
  //   };
  //   // eslint-disable-next-line prefer-const
  //   let saveData = await this.PurposeOfVendorRepository.save(userData);
  //  
  //   if (saveData) {
  //     return { status: true, message: 'purpose created created Successffuly' };
  //   } else {
  //     return { status: false, message: 'Something went wrong' };
  //   }
  // }
  // async getAllPurpose() {
  // return await this.PurposeOfVendorRepository.find({
  //   select: ['id', 'purposeName'],
  // });
  // }

  // async getPurposeById(id) {
  //   return await this.PurposeOfVendorRepository.findOne({
  //     select: ['id', 'purposeName'],
  //     where: {
  //       id: id,
  //     },
  //   });
  // }
  // async deletePurpose(id) {
  //   
  //   let soft = await this.PurposeOfVendorRepository.softDelete({ id: id });
  //   if (soft.raw.affectedRows) {
  //     await this.PurposeOfVendorRepository.update(
  //       { id: id },
  //       { deletedAt: Date },
  //     );
  //   }
  //   return { success: true };
  // }
  // async editPurpose(data, id) {
  //   await this.PurposeOfVendorRepository.update(
  //     { id: id },
  //     {
  //       purposeName: data.purposeName,
  //     },
  //   );
  //   return { success: true };
  // }
}
