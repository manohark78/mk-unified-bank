import { createContext, useContext, useState } from 'react';

const RoleContext = createContext({ role: 'USER', setRole: () => {} });

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('ADMIN'); // temporary
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export default RoleContext;