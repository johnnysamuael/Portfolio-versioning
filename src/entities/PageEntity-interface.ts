/* eslint-disable camelcase */
export interface PagesInput {
    name: string
    url: string
    versionId: number
  }

  export enum VersionType {
    published ='published',
    draft = 'draft',
    snapshot = 'snapshot'
  }

export interface VersionInput {
    versionType: string
    portfolioId: number
    isActive: boolean
}

export interface PortfolioInput {
    name: string
    url: string
  }

  export interface PagesOutput {
    id: number
    name: string
    url: string
  }
