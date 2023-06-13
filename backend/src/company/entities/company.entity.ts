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


@Entity('statelist')
export class stateList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

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
@Entity('citylist')
export class cityList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @ManyToOne(() => stateList, (sl) => sl.id)
  @JoinColumn({ name: 'state' })
  state: stateList;

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

@Entity('typeofenterprises')
export class typeOfEnterprises {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enterpriseType: string;

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
@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  enterpriseEmail: string;

  @Column()
  mobile: string;

  @Column({ default: null })
  websiteUrl: string;

  @ManyToOne(() => typeOfEnterprises, (toe) => toe.id)
  @JoinColumn({ name: 'enterprisesType' })
  enterprisesType: typeOfEnterprises;

  @ManyToOne(() => stateList, (sl) => sl.id)
  @JoinColumn({ name: 'state' })
  state: stateList;

  @ManyToOne(() => cityList, (cl) => cl.id)
  @JoinColumn({ name: 'city' })
  city: cityList;

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

  @Column({length:350})
  address: string;

  @Column()
  logoUrl: string;

}
@Entity('companyemployeetypemapping')
export class companyEmployeeTypeMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeType: string;

  @ManyToOne(() => Company, (com) => com.id)
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
