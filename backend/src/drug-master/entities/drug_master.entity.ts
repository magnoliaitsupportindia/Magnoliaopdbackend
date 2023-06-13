import { Company } from 'src/company/entities/company.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
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
@Entity('drugmaster')
export class DrugMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  drugName: string;

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

@Entity('drugrequestmaster')
export class DrugrequestMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestid: string;

  @Column()
  requestby: number;

  @CreateDateColumn()
  requestdate: Date;

}

// @Entity('drugrequestmapping')
// export class DrugrequestMapping {
//   @PrimaryGeneratedColumn()
//   id: number;
  

//   @ManyToOne(() => DrugrequestMaster, (d) => d.id)
//   @JoinColumn({ name: 'requestid' })
//   requestid: DrugrequestMaster;

//   @Column()
//   itemdescription: string;

//   @CreateDateColumn()
//   requestdate: Date;

//   @CreateDateColumn()
//   estimateddeliverydate: Date;

//   @Column()
//   requestqty: number;

//   @Column()
//   isbudgeted: boolean;

//   @Column()
//   requestby: number;


//   @Column()
//   statusid: number;


//   @Column()
//   modifiedby: number;

//   @Column()
//   requestDept: number;

// }
