import { Company } from 'src/company/entities/company.entity';
import { DepartmentMaster } from 'src/department-master/entities/department-master.entity';
import { DrugMaster } from 'src/drug-master/entities/drug_master.entity';
import { employee } from 'src/employee/entities/employee.entity';
import { HospitalMaster } from 'src/hospital-master/entities/hospital-master.entity';
import { IncidentMaster } from 'src/incident-master/entities/incident-master.entity';
import { SickMaster } from 'src/sick-master/entities/sick-master.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { VendorMaster } from 'src/vendor-master/entities/vendor-master.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('visitors')
export class visitors {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  visitorName: string;

  @Column()
  contactNumber:string;

  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'companyId' })
  companyId: Company;
  
  @ManyToOne(() => DepartmentMaster, (dep) => dep.id)
  @JoinColumn({ name: 'department' })
  department: DepartmentMaster;

  @ManyToOne(() => employee, (emp) => emp.id)
  @JoinColumn({ name: 'contactPerson' })
  contactPerson: employee;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserManagement;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserManagement;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserManagement;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity("opdregister")
export class OpdRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => employee, (emp) => emp.id)
  @JoinColumn({ name: 'empId' })
  empId: employee;

  @ManyToOne(() => visitors, (visit) => visit.id)
  @JoinColumn({ name: 'visitorsId' })
  visitorsId: visitors;

  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'companyId' })
  companyId: Company;

  @Column()
  care: string;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserManagement;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserManagement;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserManagement;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => IncidentMaster, (com) => com.id)
  @JoinColumn({ name: 'complaintsType' })
  complaintsType: IncidentMaster;

  @ManyToOne(() => HospitalMaster, (hos) => hos.id)
  @JoinColumn({ name: 'hospitalId' })
  hospitalId: HospitalMaster;
}
@Entity('opddrugmap')
export class optDrugMap {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => OpdRegister, (opd) => opd.id)
  @JoinColumn({ name: 'opdId' })
  opdId: OpdRegister;
  
  @ManyToOne(() => DrugMaster, (drug) => drug.id)
  @JoinColumn({ name: 'drugId' })
  drugId: DrugMaster;

  @Column()
  count: number;

  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'companyId' })
  companyId: Company;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserManagement;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserManagement;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserManagement;

  @DeleteDateColumn()
  deletedAt: Date;
}
@Entity('opdsickmap')
export class optsickMap {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => OpdRegister, (opd) => opd.id)
  @JoinColumn({ name: 'opdId' })
  opdId: OpdRegister;

  @ManyToOne(() => SickMaster, (sick) => sick.id)
  @JoinColumn({ name: 'complaints' })
  complaints: SickMaster;
  
  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'companyId' })
  companyId: Company;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserManagement;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: UserManagement;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserManagement, (user) => user.id)
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: UserManagement;

  @DeleteDateColumn()
  deletedAt: Date;
}