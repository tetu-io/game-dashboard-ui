import { NgModule } from '@angular/core';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '@environments/environment';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const TETU_GAME_URI = environment.SUBGRAPH_URI;

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

export function createTetuGameSubgraph(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: TETU_GAME_URI }),
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
          GAME_SUBGRAPH: createTetuGameSubgraph(httpLink),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
