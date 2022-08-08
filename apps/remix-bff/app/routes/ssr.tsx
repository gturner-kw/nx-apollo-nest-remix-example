import {
  SetListDocument,
  SetListQuery,
  AddSetDocument,
  AddSetMutation,
  AddSetMutationVariables,
} from '@nx-apollo-nest-remix-example/data-access';
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';
import { initApolloClient } from '~/context/apollo';
import { ApolloQueryResult } from '@apollo/client';
import styles from '../styles/index.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

const apolloClient = initApolloClient(true);

export const loader: LoaderFunction = async ({ request }) => {
  return await apolloClient.query<SetListQuery>({
    query: SetListDocument,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get('name');
  const year = form.get('year');
  const numPartsStr = form.get('numParts');

  if (
    typeof name !== 'string' ||
    typeof year !== 'string' ||
    typeof numPartsStr !== 'string'
  ) {
    throw new Error('invalid parameters');
  }

  const numParts = Number.parseInt(numPartsStr);

  await apolloClient.mutate<AddSetMutation, AddSetMutationVariables>({
    mutation: AddSetDocument,
    variables: { name, year, numParts },
    update(cache, result) {
      const { addSet } = result?.data || {};
      cache.modify({
        fields: {
          allSets(existingSets = []) {
            return [...existingSets, addSet];
          },
        },
      });
    },
  });

  return {};
};

export default function Index() {
  const { data, loading, error } =
    useLoaderData<ApolloQueryResult<SetListQuery>>();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{'Error :( ' + error}</p>;

  return (
    <div>
      <div className="container">
        <h1>SSR</h1>
      </div>
      <div className="container">
        <div className="set-list">
          <h2>Lego Sets:</h2>
          <ul>
            {data?.allSets?.map((item) => {
              const { id, name, numParts, year } = item || {};
              return (
                <li key={id}>
                  {year} - <strong>{name}</strong> ({numParts} parts)
                </li>
              );
            })}
          </ul>
        </div>
        <div className="set-form">
          <form method="post">
            <label>Name:</label>
            <input name="name"></input>
            <br />
            <label>Year:</label>
            <input name="year"></input>
            <br />
            <label>Number of Parts:</label>
            <input name="numParts" defaultValue="1000"></input>
            <br />
            <button type="submit">Create new set</button>
          </form>
        </div>
      </div>
    </div>
  );
}
