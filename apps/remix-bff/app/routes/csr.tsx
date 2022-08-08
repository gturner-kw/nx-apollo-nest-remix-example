import {
  useAddSetMutation,
  useSetListQuery,
} from '@nx-apollo-nest-remix-example/data-access';
import { FormEvent, useState } from 'react';
import styles from '../styles/index.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Index() {
  const { loading, error, data } = useSetListQuery();
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [numParts, setNumParts] = useState(1000);

  const [addSetMutation] = useAddSetMutation({
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addSetMutation();
    setName('');
    setYear('');
    setNumParts(1000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{'Error :( ' + error}</p>;

  return (
    <div>
      <div className="container">
        <h1>CSR</h1>
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
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label>Year:</label>
            <input
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <br />
            <label>Number of Parts:</label>
            <input
              name="numParts"
              value={numParts}
              onChange={(e) => setNumParts(+e.target.value)}
            />
            <br />
            <button type="submit">Create new set</button>
          </form>
        </div>
      </div>
    </div>
  );
}
