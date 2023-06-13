import { Company } from 'src/company/entities/company.entity';
import { DepartmentMaster } from 'src/department-master/entities/department-master.entity';
import { DesignationMaster } from 'src/designation-master/entities/designation-master.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { VendorMaster } from 'src/vendor-master/entities/vendor-master.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('employee')
export class employee {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ length: 15 })
  mobile: string;

  @Column({ length: 15 })
  emergencyMobile: string;

  @Column()
  dob: Date;

  @Column()
  bloodGroup: string;

  @Column()
  location: string;

  @Column()
  gender: string;

  @ManyToOne(() => DesignationMaster, (desc) => desc.id)
  @JoinColumn({ name: 'designation' })
  designation: DesignationMaster;

  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'company' })
  company: Company;

  @ManyToOne(() => DepartmentMaster, (dept) => dept.id)
  @JoinColumn({ name: 'department' })
  department: DepartmentMaster;

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

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @Column({default:null})
  employeeType: number;

  @ManyToOne(() => VendorMaster, (ven) => ven.id)
  @JoinColumn({ name: 'vendorId' })
  vendorId: VendorMaster;
}
// push(res: any) {
//   throw new Error('Method not implemented.');
// }