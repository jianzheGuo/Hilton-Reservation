/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

import { ApiContext } from './contexts/ApiContext';
import fetchPlus from './utils/fetchPlus';

// import { ApolloProvider } from '@apollo/client';
// import { client } from './utils/apollo';

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => {
  return (
    <ApiContext.Provider value={{ fetchPlus }}>
      {/* <ApolloProvider client={client}> */}
        <App />
      {/* </ApolloProvider> */}
    </ApiContext.Provider>
  );
}, root);
