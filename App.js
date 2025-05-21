
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, []);

  async function getTransactions() {
    try {
      const url = process.env.REACT_APP_API_URL + '/transaction';
      const response = await fetch(url);
      const json = await response.json();
      setTransactions(json);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/api/transactions';

    const parts = name.trim().split(' ');
    const priceString = parts[0];
    const price = parseFloat(priceString);

    if (isNaN(price)) {
      alert('Invalid transaction format. Start with a number like "+200" or "-100".');
      return;
    }

    const cleanName = parts.slice(1).join(' ');

    try {
      const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      price,
      name: cleanName,
      description,
      datetime,
  }),
});

const text = await response.text(); 
console.log('Raw response:', text);

if (!response.ok) throw new Error('Failed to save transaction');

      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]); 
      setName('');
      setDateTime('');
      setDescription('');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  // Calculate balance
  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  const [integerPart, fractionPart = '00'] = balance.toFixed(2).split('.');

  return (
    <main>
      <h1>
        ${integerPart}
        <span>.{fractionPart}</span>
      </h1>

      <form onSubmit={addNewTransaction}>
        <div className="basics">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200 new Samsung TV"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDateTime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add New Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price < 0 ? '-' : '+'}${Math.abs(transaction.price)}
                </div>
                <div className="datetime">
                  {new Date(transaction.datetime).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
