// Importar dependencias de Vue y GraphQL
import { provideApolloClient } from "@vue/apollo-composable";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";

// Requerir la variable de entorno con el token de Github
const token = import.meta.env.VITE_APP_GH_TOKEN;

// Creamos un interceptor para agregar el token de Github a la cabecera de la peticion
const additiveLink = from([
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    }));
    return forward(operation);
  }),
  new HttpLink({ uri: "https://api.github.com/graphql" }),
]);

// Se genera el cliente de Apollo
const apolloClient = new ApolloClient({
  link: additiveLink,
  cache: new InMemoryCache(),
});

// Funcion que provee el cliente de Apollo al componente
export function useApollo() {
  // Se inyecta el cliente de Apollo
  provideApolloClient(apolloClient);
}
