import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';

function App() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

export default App;
