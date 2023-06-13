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

@Entity('moduletable')
export class moduleTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  moduleName: string;

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

  @DeleteDateColumn({ type: "datetime" })
  deletedAt: Date;
}

@Entity('submodule')
export class subModule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => moduleTable, (m) => m.id)
  @JoinColumn({ name: 'ModuleId' })
  moduleId: number;

  @Column()
  subModuleName: string;

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

@Entity('screens')
export class screens {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => subModule, (subModule) => subModule.id)
  @JoinColumn({ name: 'SubModuleId' })
  subModuleId: number;

  @Column()
  screenName: string;

  @Column()
  url: string;

  @Column()
  isPublishToDashboard: boolean;

  @Column()
  displayName: string;

  @Column()
  iconName: string;

  @Column()
  ishoddisplay: boolean;

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


@Entity('masterreporttail')
export class masterReportTail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taileName: string;

  @ManyToOne(() => moduleTable, (m) => m.id)
  @JoinColumn({ name: 'moduleId' })
  moduleId: number;

  @Column()
  isActive: boolean;

  @Column()
  url: string;
  

}