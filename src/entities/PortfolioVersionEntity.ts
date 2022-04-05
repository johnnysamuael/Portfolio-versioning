/* eslint-disable camelcase */
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import PageEntity from './PageEntity';
import PortfolioEntity from './PortfolioEntity';



@ObjectType('Version')
@Entity()
export default class PortfolioVersionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  versionType: string

  @Field()
  @Column('tinyint', { nullable: false})
  isActive: boolean
  
  @ManyToOne(() => PortfolioEntity, { nullable: false })
  @JoinColumn({ name: 'portfolioId' })
  portfolio: PortfolioEntity
  
  @Column('int', { nullable: false})
  portfolioId: number
  
  @OneToMany(() => PageEntity, (page) => page.version)
  pages?: PageEntity[]

  @Column()
  
  @Field()
  @CreateDateColumn()
   createdAt: Date

  @Field()
  @UpdateDateColumn()
   updatedAt: Date
}
