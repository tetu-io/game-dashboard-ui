import { NgModule } from '@angular/core';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '@environments/environment';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const FANTOM_GAME_SUBGRAPH = environment.FANTOM_GAME_SUBGRAPH;
const REAL_GAME_SUBGRAPH = environment.REAL_GAME_SUBGRAPH;
const SONIC_GAME_SUBGRAPH = environment.SONIC_GAME_SUBGRAPH;


const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  },
};

export function createFantomGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: FANTOM_GAME_SUBGRAPH }),
    cache: new InMemoryCache({
      resultCaching: true,
    }),
    defaultOptions,
  };
}

export function createRealGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: REAL_GAME_SUBGRAPH }),
    cache: new InMemoryCache({
      resultCaching: true,
    }),
    defaultOptions,
  };
}

export function createSonicGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: SONIC_GAME_SUBGRAPH }),
    cache: new InMemoryCache({
      resultCaching: true,
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
          FANTOM_GAME_SUBGRAPH: createFantomGameSubgraph(httpLink),
          REAL_GAME_SUBGRAPH: createRealGameSubgraph(httpLink),
          SONIC_GAME_SUBGRAPH: createSonicGameSubgraph(httpLink),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
