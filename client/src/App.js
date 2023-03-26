import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function registerUser(e) {
    e.preventDefault();
    console.log('registerUser');
      const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword
      }),
    })

    const data = await response.json();
    console.log(data);
  }

  return (
    <div>
      <h1> Registration </h1>
      <form onSubmit={registerUser}>
        <input
        value={name}
        onChange={e => setName(e.target.value)}
        type="text"
        placeholder="Name"
        /> <br />

        <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
        /> <br />

        <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        /> <br />

        <input
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Confirm Password"
        /> <br />

      <input type="submit" value="Register" />
      </form>

    </div>
    );
}

export default App;
