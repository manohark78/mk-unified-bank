import { useRole } from './RoleContext/RoleContext.jsx';

import AccountList from './AccountList.jsx';
import AccountActions from './AccountActions.jsx';
const AccountsPage = () => {
  const { role } = useRole();
  const isAdmin = role === 'ADMIN';

  return (
    <section className="grid-2">
      <div className="card">
        <h2>All Accounts</h2>
        <AccountList isAdmin={isAdmin} />
      </div>
      <div className="card">
        <h2>Deposit / Withdraw</h2>
        <AccountActions isAdmin={isAdmin} />
      </div>
    </section>
  );
};

export default AccountsPage;