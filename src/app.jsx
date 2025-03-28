import React from 'react';

export default function App() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState(0)
  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}