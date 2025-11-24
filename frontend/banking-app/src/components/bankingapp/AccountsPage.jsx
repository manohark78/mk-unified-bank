import { useRole } from './RoleContext/RoleContext.jsx';
import AddAccount from './AddAccount.jsx';
import AccountList from './AccountList.jsx';
import AccountActions from './AcountActions.jsx';
const AccountsPage = () => {
  const { role } = useRole();
  const isAdmin = role === 'ADMIN';

  return (
    <section className="grid-2">
      {isAdmin && (
        <div className="card">
          <h2>Create Account</h2>
          <AddAccount />
        </div>
      )}
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