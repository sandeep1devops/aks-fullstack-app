// function App() {
//   return (
//     <div>
//       <h1>React is Working!</h1>
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const callBackend = async () => {
    try {
      const response = await fetch('/api');
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Error connecting to backend');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>React Frontend</h1>

      <button onClick={callBackend}>
        Call Backend
      </button>

      <h2>{message}</h2>
    </div>
  );
}

export default App;