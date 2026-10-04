import React from 'react';

export const Toggle = ({ on, set, dis, children }) => (
  <label className="tg">
    <input 
      type="checkbox" 
      checked={on} 
      disabled={dis} 
      onChange={e => set(e.target.checked)} 
    /> 
    {children}
  </label>
);
