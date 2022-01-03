import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";

export const getCharactersClient = () => {
    const link = new HttpLink({
        uri: "https://rickandmortyapi.com/graphql",
    });
    const cache = new InMemoryCache();
    return new ApolloClient({
        link,
        cache,
        queryDeduplication: false,
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network",
            }
        },
    });
}