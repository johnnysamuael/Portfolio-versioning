/* eslint-disable camelcase */
import { Field } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PortfolioVersionEntity from './PortfolioVersionEntity';


@Entity('Pages')
export default class PageEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false })
  url: string;

  @ManyToOne(() => PortfolioVersionEntity, { nullable: false })
  @JoinColumn({ name: 'versionId' })
  version: PortfolioVersionEntity;

  @Field()
  @Column({ nullable: false })
  versionId: number
}
