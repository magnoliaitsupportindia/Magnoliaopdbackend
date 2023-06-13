import { Company } from 'src/company/entities/company.entity';
// import { DepartmentMaster } from 'src/department-master/entities/department-master.entity';
import { Rolemanagement } from 'src/rolemanagement/entities/rolemanagement.entity';
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
@Entity('usermanagement')
export class UserManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ length: 15 })
  mobile: string;

  @Column({ length: 500 })
  address: string;

  @ManyToOne(() => Company, (comp) => comp.id)
  @JoinColumn({ name: 'company' })
  company: Company;

  @Column()
  password: string;

  @ManyToOne(() => Rolemanagement, (role) => role.id)
  @JoinColumn({ name: 'role' })
  role: Rolemanagement;

  @Column({ default: null })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: null })
  updatedBy: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: null })
  deletedBy: number;
}
