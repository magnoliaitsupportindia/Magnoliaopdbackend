import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateOpdRegisterDto } from './dto/create-opd-register.dto';
import { UpdateOpdRegisterDto } from './dto/update-opd-register.dto';
import {
  OpdRegister,
  visitors,
  optDrugMap,
  optsickMap,
} from './entities/opd-register.entity';

@Injectable()
export class OpdRegisterService {
  constructor(
    @InjectRepository(visitors)
    private visitorRepository: Repository<visitors>,

    @InjectRepository(OpdRegister)
    private opdRegisterRepository: Repository<OpdRegister>,

    @InjectRepository(optDrugMap)
    private optDrugMapRepository: Repository<optDrugMap>,

    @InjectRepository(optsickMap)
    private optsickMapRepository: Repository<optsickMap>,
  ) {}

  //  service part start

  async addOpd(empData) {
    let saveData = await this.opdRegisterRepository.save(empData);
    return saveData;
  }

  async addDrugOpd(drugMap) {
    let saveDrug = await this.optDrugMapRepository.save(drugMap);
    return saveDrug;
  }

  async addSickOpd(complaint) {
    let saveComplaints = await this.optsickMapRepository.save(complaint);
    return saveComplaints;
  }

  async signUpData(user, company) {
    let companyDetail = await getManager().query(`SELECT id,companyName as company FROM company where deletedAt is null and id =${company}`);
    let designation = await getManager().query(`SELECT id,designationName as designation FROM designationmaster where deletedAt is null and companyId=${company};`);
    let department = await getManager().query(`SELECT id,departmentName as department FROM departmentmaster where deletedAt is null and companyId=${company};`);
    let employeeType= await getManager().query(`Select id, employeeType from companyemployeetypemapping where deletedAt is null and companyId=${company};`)
    let vendor= await getManager().query(`select id,vendorName from vendormaster where deletedAt is null and companyId=${company}`)
    let overallData = {
      company: companyDetail,
      department: department,
      designation: designation,
      vendor:vendor,
      employeeType:employeeType
    };
    return overallData;
  }

  async getallOpd(companyDetail, date) {
    let userDetails = await getManager().query(
      ` select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
      op.createdAt,d.departmentName,
      GROUP_CONCAT(s.sickName) as complaints 
      from opdregister op
      join employee e on e.id = op.empId 
      join company c on e.company=c.id
      join opdsickmap osm on op.id = osm.opdId
      join sickmaster s on s.id = osm.complaints
      inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and op.companyId=${companyDetail} and DATE(op.createdAt)='${date}'
      GROUP BY op.id  ORDER BY op.createdAt DESC`,
      // limit ${}
    );
    let companyUSer = await getManager().query(`
    select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints 
    from opdregister op
    join employee e on e.id = op.empId 
    join company c on e.company=c.id
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and e.company=${companyDetail}
    and date(op.createdAt)= '${date}' and e.employeeType=1
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `);
    let nonCompanyUser = await getManager().query(`
    select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints 
    from opdregister op
    join employee e on e.id = op.empId 
    join company c on e.company=c.id
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and e.company=${companyDetail}
    and date(op.createdAt)= '${date}' and e.employeeType=2
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `);

    let visit=await getManager().query(`
    select v.id,v.visitorName,op.care,e.firstName,e.lastName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints from opdregister op
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    join visitors v on v.id=op.visitorsId
    join employee e on v.contactPerson =e.id
    inner join departmentmaster d on v.department=d.id where op.deletedAt is null and op.companyId=${companyDetail} and DATE(op.createdAt)='${date}'
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `)
    return { userDetails, companyUSer, nonCompanyUser,visit };
  }


  async getallOpdByDate(companyDetail,start,end) {
    let userDetails = await getManager().query(
      ` select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
      op.createdAt,d.departmentName,
      GROUP_CONCAT(s.sickName) as complaints 
      from opdregister op
      join employee e on e.id = op.empId 
      join company c on e.company=c.id
      join opdsickmap osm on op.id = osm.opdId
      join sickmaster s on s.id = osm.complaints
      inner join departmentmaster d on e.department=d.id
       where op.deletedAt is null 
       and e.deletedAt is null 
       and op.companyId=${companyDetail} 
       and (DATE(op.createdAt) >= '${start}' and DATE(op.createdAt)<='${end}')
      GROUP BY op.id  ORDER BY op.createdAt DESC`,
      // limit ${}
    );
    let companyUSer = await getManager().query(`
    select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints 
    from opdregister op
    join employee e on e.id = op.empId 
    join company c on e.company=c.id
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and e.company=${companyDetail}
    and (DATE(op.createdAt) >= '${start}' and DATE(op.createdAt)<='${end}') and e.employeeType=1
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `);
    let nonCompanyUser = await getManager().query(`
    select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints 
    from opdregister op
    join employee e on e.id = op.empId 
    join company c on e.company=c.id
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and e.company=${companyDetail}
    and (DATE(op.createdAt) >= '${start}' and DATE(op.createdAt)<='${end}') and e.employeeType=2
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `);

    let visit=await getManager().query(`
    select v.id,v.visitorName,op.care,e.firstName,e.lastName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints from opdregister op
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    join visitors v on v.id=op.visitorsId
    join employee e on v.contactPerson =e.id
    inner join departmentmaster d on v.department=d.id 
    where op.deletedAt is null 
    and op.companyId=${companyDetail} 
    and (DATE(op.createdAt) >= '${start}' and DATE(op.createdAt)<='${end}')
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `)
    return { userDetails, companyUSer, nonCompanyUser,visit };
  }

  async getOpdById(id) {
    let userDetails = await getManager().query(
      `select op.id,e.firstName as firstname,e.lastName as lastname,op.empId,op.care,c.companyName,
      op.createdAt,d.departmentName from opdregister op
      join employee e on e.empId = op.empId 
      join company c on e.company=c.id
      join departmentmaster d on e.department=d.id  where op.deletedAt is null and op.id=?;`,
      [id],
    );
    let complaints = await getManager().query(
      `  SELECT op.id, GROUP_CONCAT(s.sickName) as complaints FROM opdregister op 
      join opdsickmap om on op.id = om.opdId
      left join sickmaster s on s.id = om.complaints where op.id=?;`,
      [id],
    );

    let drugDetails = await getManager().query(
      `SELECT op.id, GROUP_CONCAT(d.drugName)as drug,GROUP_CONCAT(om.count)as count FROM opdregister op 
       join opddrugmap om on op.id = om.opdId
       left join drugmaster d on d.id = om.drugId where op.id=?;`,
      [id],
    );
    return { userDetails,complaints,drugDetails };
  }

  async getOpdEmp(id, company) {
    let userDetails = await getManager().query(
      `SELECT concat(e.firstName,e.lastName) as name,e.id,e.dob as age,d.departmentName,ds.designationName,
      e.gender,c.companyName,vm.vendorName FROM employee e
      join company c on c.id=e.company
      join designationmaster ds on ds.id=e.designation
      left join vendormaster vm on vm.id=e.vendorId
      join departmentmaster d on d.id=e.department where e.deletedAt is null and e.empId=? and e.company = ${company}`,
      [id],
    );
    return userDetails ;
  }

  async getCountOfSick(company, date) {
    let sickCount = await getManager().query(
      `select s.id,s.sickName ,count(osm.complaints) as count from opdsickmap osm
      left join sickmaster s on s.id=osm.complaints
      join opdregister opr on opr.id = osm.opdId
      left join employee e on opr.empId=e.id
      where s.deletedAt is null && e.deletedAt is null && opr.companyId =${company} and opr.deletedAt is null and DATE(opr.createdAt)='${date}' group by s.id;`,
    );
    let totalcount = await getManager()
      .query(`SELECT count(*) as TotalPatients FROM opdregister op 
       left join employee e on e.id=op.empId
       where op.deletedAt is null and e.deletedAt is null and op.companyId=${company} and DATE(op.createdAt)='${date}';`);

    return { sickCount, totalcount };
  }

  async getCountOfSickByDate(company, start,end) {
    let sickCount = await getManager().query(
      `select s.id,s.sickName ,count(osm.complaints) as count from opdsickmap osm
      left join sickmaster s on s.id=osm.complaints
      join opdregister opr on opr.id = osm.opdId
      left join employee e on opr.empId=e.id
      where s.deletedAt is null && e.deletedAt is null && opr.companyId =${company} and 
      opr.deletedAt is null and (DATE(opr.createdAt) >= '${start}' and DATE(opr.createdAt)<='${end}') group by s.id;`,
    );
    let totalcount = await getManager()
      .query(`SELECT count(*) as TotalPatients FROM opdregister op 
      left join employee e on e.id=op.empId
      where op.deletedAt is null and e.deletedAt is null and op.companyId=${company}
      and (DATE(op.createdAt) >= '${start}' and DATE(op.createdAt)<='${end}')`);

    return { sickCount, totalcount };
  }
  async getVisitHistory(id, company) {
    // let visitDetails = await getManager().query(
    //   `select op.id as opdId,op.care,op.createdAt as dateOfVisit,u.name as doctor from opdregister op
    //   join usermanagement u on u.id=op.createdBy
    //   where op.empId=${id} and op.companyId=${company}`,
    // );
    // let sick = await getManager().query(
    //   `SELECT op.id as opdId, GROUP_CONCAT(s.sickName) as complaints FROM opdregister op 
    //     join opdsickmap om on op.id = om.opdId
    //     left join sickmaster s on s.id = om.complaints where op.empId=${id} and op.companyId=${company} GROUP BY op.id;`,
    // );
    // let drug = await getManager().query(
    //   `SELECT op.id as opdId, GROUP_CONCAT(d.drugName)as givenDrug,GROUP_CONCAT(om.count)as count FROM opdregister op 
    //       join opddrugmap om on op.id = om.opdId
    //       left join drugmaster d on d.id = om.drugId where op.empId=${id} and op.companyId=${company} group by op.id`,
    // );
    let visitDetails = await getManager().query(`
    select c.id, GROUP_CONCAT(CONCAT_WS('-',dm.drugName,odm.count)) as givenDrug,c.complaints,c.care,c.doctor,c.createdAt
    from (select GROUP_CONCAT(s.sickName) as complaints ,op.id as id,op.care,u.name as doctor,op.createdAt
    from opdregister op
    left join employee e on e.id = op.empId 
    left join usermanagement u on u.id=op.createdBy
    left join opdsickmap osm on op.id = osm.opdId
    left join sickmaster s on s.id = osm.complaints
    where op.companyId=${company} and op.empId=${id}
    GROUP BY op.id) c 
    left join opddrugmap odm on odm.opdId=c.id
    left join drugmaster dm on dm.id = odm.drugId 
    group by c.id;`)
    return { visitDetails };
  }

  async getEmpidById(id) {
    let userDetails = await getManager().query(
      `SELECT empId from employee WHERE empId LIKE '%${id}%'`,
    );
    return { userDetails };
  }

  async patientAddData(companyId) {
    let incident = await getManager().query(
      `select id,incidentName from incidentmaster where deletedAt is null and companyId=${companyId};`,
    );
    let complaints = await getManager().query(
      `SELECT sickname,id from sickmaster where deletedAt is null and companyId=${companyId} or id = 1;`,
    );
    let drugs = await getManager().query(
      `select drugName,id from drugmaster where deletedAt is null and companyId=${companyId};`,
    );
    let hospital = await getManager().query(
      `select id,hospitalName from hospitalmaster where deletedAt is null and companyId=${companyId};`,
    );
    let overallData = { complaints, drugs, incident,hospital };
    return overallData;
  }

  async addvisitor(visitors){
    let added= await this.visitorRepository.save(visitors)
    return added;
  }

  async visiter(date,company){
    let visit=await getManager().query(`
    select v.id,v.visitorName,op.care,e.firstName,e.lastName,
    op.createdAt,d.departmentName,
    GROUP_CONCAT(s.sickName) as complaints from opdregister op
    join opdsickmap osm on op.id = osm.opdId
    join sickmaster s on s.id = osm.complaints
    join visitors v on v.id=op.visitorsId
    join employee e on v.contactPerson =e.id
    inner join departmentmaster d on v.department=d.id where op.deletedAt is null and op.companyId=${company} and DATE(op.createdAt)='${date}'
    GROUP BY op.id  ORDER BY op.createdAt DESC
    `)
    return visit;
  }
}

// select GROUP_CONCAT(CONCAT_WS('-',dm.drugName,odm.count)) as givenDrug,c.complaints,c.id,c.firstname,c.care,c.doctor from (select GROUP_CONCAT(s.sickName) as complaints ,op.id as id,e.firstName as firstname,op.care,u.name as doctor
//  from opdregister op
// left join employee e on e.id = op.empId 
// left join usermanagement u on u.id=op.createdBy
// left join opdsickmap osm on op.id = osm.opdId
// left join sickmaster s on s.id = osm.complaints
// where op.companyId=1
// GROUP BY op.id) c 
// left join opddrugmap odm on odm.opdId=c.id
// left join drugmaster dm on dm.id = odm.drugId  
// group by c.id;



























// savesick && saveDrug && saveData

// let complaints = await getManager().query(
//   `SELECT op.id, GROUP_CONCAT(s.sickName) as complaints FROM opdregister op
//   join opdsickmap om on op.id = om.opdId
//   left join sickmaster s on s.id = om.complaints GROUP BY op.id`,
// );
// select op.id,e.firstname,e.lastname,op.empId,op.care,c.companyName,
//   op.createdAt,d.departmentName,
//   GROUP_CONCAT(dm.drugName)as drug,GROUP_CONCAT(om.count)as count ,
//   GROUP_CONCAT(s.sickName) as complaints
//   from opdregister op
//   join employee e on e.id = op.empId
//   join company c on e.company=c.id
//   join opddrugmap om on op.id = om.opdId
//   join drugmaster dm on dm.id = om.drugId
//   join opdsickmap osm on op.id = osm.opdId
//   join sickmaster s on s.id = osm.complaints
//   inner join departmentmaster d on e.department=d.id where op.deletedAt is null
//   GROUP BY op.id`
// // let drugDetails = await getManager().query(
// //   `SELECT op.id, GROUP_CONCAT(d.drugName)as drug,GROUP_CONCAT(om.count)as count FROM opdregister op
//    join opddrugmap om on op.id = om.opdId
//    left join drugmaster d on d.id = om.drugId GROUP BY op.id`,
// );

// let drugMap = [];
// data.drugId.forEach((e, i) => {
//   drugMap.push({
//     drugId: e,
//     count: data.counts[i],
//     opdId: saveData.id,
//   });
// });

// let saveDrug = await this.optDrugMapRepository.save(drugMap);

// let complaint = [];
// data.complaintsId.forEach((e,i) => {
//   complaint.push({
//     opdId:saveData.id,
//     complaints:data.complaintsId[i]
//   })
// });
// let savesick = await this.optsickMapRepository.save(complaint);

//   if (savesick && saveDrug && saveData) {
//     return { status: true, message: 'OPD user added Successffuly' };
//   } else {
//     return { status: false, message: 'Something went wrong' };
//   }
// }

//   select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
// op.createdAt,d.departmentName,
// GROUP_CONCAT(s.sickName) as complaints
// from opdregister op
// join employee e on e.id = op.empId
// join company c on e.company=c.id
// join opdsickmap osm on op.id = osm.opdId
// join sickmaster s on s.id = osm.complaints
// inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and op.companyId=1 and DATE(op.createdAt)='2022-06-08'
// GROUP BY op.id  ORDER BY op.createdAt DESC

// raw query to getall opd

//  select e.id as eid,op.id,e.firstName as firstname,e.lastName as lastname,e.empId,op.care,c.companyName,
// op.createdAt,d.departmentName,
// GROUP_CONCAT(s.sickName) as complaints
// from opdregister op
// join employee e on e.id = op.empId
// join company c on e.company=c.id
// join opdsickmap osm on op.id = osm.opdId
// join sickmaster s on s.id = osm.complaints
// inner join departmentmaster d on e.department=d.id where op.deletedAt is null and e.deletedAt is null and op.companyId=${companyDetail} and DATE(op.createdAt)=Date("${date}")
// GROUP BY op.id  ORDER BY op.createdAt DESC
