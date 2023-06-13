import { Company } from 'src/company/entities/company.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
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

@Entity('vendormaster')
export class VendorMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorName: string;

  @Column()
  purposeOfVendor: string;

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

  @ManyToOne(() => Company, (com) => com.id)
  @JoinColumn({ name: 'companyId' })
  companyId: Company
}
