import { Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getManager, getRepository } from 'typeorm';
import PageEntity from '../entities/PageEntity';
import { PagesInput, PortfolioInput, VersionInput, VersionType } from '../entities/PageEntity-interface';
import PortfolioEntity from '../entities/PortfolioEntity';
import PortfolioVersionEntity from '../entities/PortfolioVersionEntity';
import { CreatePortfolioArgs, GetByIdArgs, ListPortfoliosGqlOutput, VersionGql, VersionGqlInput } from './ListPortfolios.gql-types';


@Resolver()
@Service()
export default class PortfoliosResolver {
  @Query(() => [ListPortfoliosGqlOutput],{ description: 'List all portfolios' })
  async listPortfolios(): Promise<ListPortfoliosGqlOutput[]> {
    const portfolioRepository = getRepository(PortfolioEntity)
   
     const out = await portfolioRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.versions','versions')
      .leftJoinAndSelect('versions.pages','pages')
      .getMany()

      const output: ListPortfoliosGqlOutput[] = []
      out.forEach(o=> {
        const portfolio: ListPortfoliosGqlOutput = {
          id: o.id,
           url: o.url,
           name: o.name,
           versions: o.versions,
        }
        output.push(portfolio)
      })
      return output
  }

  @Query(() => [VersionGql],{ description: 'List all versions' })
  async listVersions(@Args() args: GetByIdArgs): Promise<VersionGql[]> {
    const versionRepository = getRepository(PortfolioVersionEntity)
   
     const versions = await versionRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.pages','pages')
      .where('portfolioId = :id', {id: args.id})
      .getMany()


     const output: VersionGql[] = []
     versions.forEach(v=> {
        const version = {
          id: v.id,
          versionType: v.versionType,
          portfolioId: v.portfolioId,
          isActive: v.isActive,
          pages: v.pages
        }
        output.push(version)
       })
       return output
      
  }
  
  @Mutation(() => PortfolioEntity,{ description: 'Add a portfolio' })
  async createPortfolio(@Args() args: CreatePortfolioArgs): Promise<PortfolioEntity> {

    return getManager().transaction(async transactionalEntityManager => {
      const portfolioRepository = transactionalEntityManager.getRepository(PortfolioEntity);
      const portfolio: PortfolioInput = {
          name: args.name,
          url: args.url,
      }

    return portfolioRepository.save(portfolio)
 
      })
  }

  @Mutation(() => PortfolioVersionEntity,{ description: 'Add a version' })
  async addVersionWithPages(@Args() args: VersionGqlInput): Promise<PortfolioVersionEntity> {

    return getManager().transaction(async transactionalEntityManager => {


      const portfolioVersionRepository = transactionalEntityManager.getRepository(PortfolioVersionEntity);
      const version: VersionInput = {
        versionType: args.versionType,
        isActive: args.isActive,
        portfolioId: args.portfolioId
      }
    const createdVersion: PortfolioVersionEntity = await portfolioVersionRepository.save(version)

    if (args.isActive === true) {
      transactionalEntityManager.getRepository(PortfolioVersionEntity).createQueryBuilder().update()
      .set({isActive: false})
      .where('id <> :curId', {curId: createdVersion.id})
      .execute();
    }

    const pagesRepository = transactionalEntityManager.getRepository(PageEntity)
    const pages: PagesInput[] =  []
    const pagesInput = args.pages
    pagesInput.forEach(page=> {
      const pageInput = {
        name: page.name,
        url: page.url,
        versionId: createdVersion.id}
      pages.push(pageInput)
    })
    
    const pagesNew: PageEntity[] = await pagesRepository.save(pages)
    createdVersion.pages = pagesNew 
     
    return createdVersion
      })
  }

  @Mutation(() => PortfolioVersionEntity,{ description: 'Add a version' })
  async createSnapshotFromDraft(@Args() args: GetByIdArgs): Promise<PortfolioVersionEntity> {

    return getManager().transaction(async transactionalEntityManager => {

      
      const portfolioVersionRepository = transactionalEntityManager.getRepository(PortfolioVersionEntity);
     const version = await portfolioVersionRepository.findOneOrFail({id: args.id},{relations: ['pages']})

     if (version.versionType !== VersionType.draft)  throw Error('Snapshots can be created only from drafts');
     

      const snapshot: VersionInput = {
        versionType: VersionType.snapshot,
        isActive: true,
        portfolioId: version.portfolioId,
      }
    const createdSnapshot: PortfolioVersionEntity = await portfolioVersionRepository.save(snapshot)

    const pagesRepository = transactionalEntityManager.getRepository(PageEntity)
    const pages: PagesInput[] =  []
    const pagesInput = createdSnapshot.pages ?? []
    pagesInput.forEach(page=> {
      const pageInput = {
        name: page.name,
        url: page.url,
        versionId: createdSnapshot.id
      }
      pages.push(pageInput)
    })
    
    const snapshotPages: PageEntity[] = await pagesRepository.save(pages)
    createdSnapshot.pages = snapshotPages
    return createdSnapshot
      })
  }
}
