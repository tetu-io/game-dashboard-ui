import { NgModule } from '@angular/core';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '@environments/environment';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const MUMBAI_GAME_SUBGRAPH = environment.MUMBAI_GAME_SUBGRAPH;
const SEPOLIA_GAME_SUBGRAPH = environment.SEPOLIA_GAME_SUBGRAPH;


const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export function createMumbaiTetuGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: MUMBAI_GAME_SUBGRAPH }),
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    defaultOptions,
  };
}

export function createSepoliaTetuGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: SEPOLIA_GAME_SUBGRAPH }),
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    defaultOptions,
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          MUMBAI_GAME_SUBGRAPH: createMumbaiTetuGameSubgraph(httpLink),
          SEPOLIA_GAME_SUBGRAPH: createSepoliaTetuGameSubgraph(httpLink),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
