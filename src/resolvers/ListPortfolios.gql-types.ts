import { ArgsType, Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { PagesOutput, VersionInput, VersionType } from "../entities/PageEntity-interface";
import PortfolioVersionEntity from "../entities/PortfolioVersionEntity";

registerEnumType(VersionType, {
    name: 'VersionType'
})

@InputType()
export class PagesGqlInput {
  
    @Field(type => String)
    name: string
  
    @Field(type => String)
    url: string
    
}

@ObjectType() 
export class PagesGqlOutput implements PagesOutput{
    
    @Field(type => Number)
    id: number

    @Field(type => String)
    name: string
  
    @Field(type => String)
    url: string

}
@ArgsType()
export class VersionGqlInput implements VersionInput {

    @Field(type => VersionType)
    versionType: VersionType

    @Field(type => Number)
    portfolioId: number
    
    @Field(type => Boolean)
    isActive: boolean

    @Field(type => [PagesGqlInput])
    pages: PagesGqlInput[]
}



@ObjectType()
export class VersionGql {
    @Field(type => Number)
    id: number

    @Field(type => VersionType)
    versionType: VersionType | string

    @Field(type => Number)
    portfolioId: number
    
    @Field(type => Boolean)
    isActive: boolean

    @Field(type => [PagesGqlOutput])
    pages?: PagesGqlOutput[]
}

@ArgsType()
export class CreatePortfolioArgs {
  
    @Field(type => String)
    name: string
  
    @Field(type => String)
    url: string
    
}

@ArgsType()
export class GetByIdArgs {
    @Field(type => Number)
    id: number
}

@ObjectType()
export class ListPortfoliosGqlOutput {
  
    @Field(type => Number)
    id: number
    
    @Field(type => String)
    name: string
  
    @Field(type => String)
    url: string

    @Field(type => [PortfolioVersionEntity])
    versions?: PortfolioVersionEntity[]

}