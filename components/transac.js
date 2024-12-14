import React, { useState } from 'react';

const TransactionHistory = () => {
  // Static data for loans
  const loans = [
    {
      loanType: 'Pensioner',
      loanAmount: 50000,
      disbursedDate: '2023-01-15',
      loanTerm: 3,
      loanStatus: 'Active',
      paymentStatus: [
        { month: 1, status: 'Paid' },

      ],
    },
    {
      loanType: 'Education',
      loanAmount: 30000,
      disbursedDate: '2023-03-01',
      loanTerm: 6,
      loanStatus: 'Disbursed',
      paymentStatus: [
        { month: 1, status: 'Paid' },
        { month: 2, status: 'Paid' },
      ],
    },
    {
      loanType: 'Personal',
      loanAmount: 70000,
      disbursedDate: '2023-05-10',
      loanTerm: 24,
      loanStatus: 'Completed',
      paymentStatus: Array(24).fill({ status: 'Paid' }), // All months paid
    },
  ];

  // Helper functions
  const calculateAmountDue = (loanType, loanAmount) => {
    const interestRates = {
      Pensioner: 0.01,
      Personal: 0.0125,
      Education: 0.0083,
    };
    return loanAmount * (interestRates[loanType] || 0);
  };

  const generateDueDates = (startDate, term) => {
    const dueDates = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < term; i++) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      dueDates.push(new Date(currentDate));
    }
    return dueDates;
  };

  const calculateProgress = (loan) => {
    if (!loan || !loan.paymentStatus || loan.loanTerm === 0) return 0;
    const paidMonths = loan.paymentStatus.filter((p) => p.status === 'Paid').length;
    return Math.min((paidMonths / loan.loanTerm) * 100, 100);
  };

  const [filter, setFilter] = useState('Active'); // Default filter
  const activeLoan = loans.find((loan) => loan.loanStatus === 'Active');

  return (
    <div className="transaction-history">
      <div className="transactions-tableb">
        <div className="transactions-headerb">
          <span>
            <i className="fas fa-calendar" style={{ marginRight: '8px' }}></i>Payment Schedule
          </span>
          {filter === 'Active' && activeLoan && (
            <div style={{ textAlign: 'center' }}>
              <div className="payprogress" style={{ position: 'relative' }}>
                <div
                  className="progressp"
                  style={{
                    width: `${calculateProgress(activeLoan)}%`,
                  }}
                ></div>
              </div>
              <h5 className="payh5">
                {activeLoan.paymentStatus.filter((p) => p.status === 'Paid').length}/
                {activeLoan.loanTerm} months paid
              </h5>
            </div>
          )}
        </div>
        <table>
          <thead className="theadb">
            <tr>
              <th>Month</th>
              <th>Amount Due</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody className="transactions-tableb">
            {loans
              .filter((transaction) => transaction.loanStatus === 'Disbursed' || transaction.loanStatus === 'Active')
              .flatMap((transaction) => {
                const amountDue = calculateAmountDue(transaction.loanType, transaction.loanAmount);
                const dueDates = generateDueDates(transaction.disbursedDate, transaction.loanTerm);

                return dueDates.map((dueDate, index) => ({
                  date: dueDate.toLocaleDateString(),
                  amountDue: amountDue.toLocaleString('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  }),
                  paymentStatus:
                    transaction.paymentStatus[index] && transaction.paymentStatus[index].status
                      ? transaction.paymentStatus[index].status
                      : 'Overdue',
                }));
              })
              .map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>calculateAmountDue</td>
                  <td
                    className={
                      transaction.paymentStatus === 'Paid'
                        ? 'status-success'
                        : 'status-failed'
                    }
                  >
                    {transaction.paymentStatus}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="transactions-tableb">
        <div className="transactions-headerb">
          <span>
            <i className="fas fa-money-bill" style={{ marginRight: '8px' }}></i> Loan History
          </span>
        </div>
        <table>
          <thead className="theadb">
            <tr>
              <th>Disbursed Date</th>
              <th>Loan Type</th>
              <th>Loan Amount</th>
              <th>Loan Term</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="transactions-tableb">
            {loans.map((loan, index) => (
              <tr key={index}>
                <td>{new Date(loan.disbursedDate).toLocaleDateString()}</td>
                <td>{loan.loanType}</td>
                <td>
                  {loan.loanAmount.toLocaleString('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  })}
                </td>
                <td>{loan.loanTerm} months</td>
                <td
                  className={
                    loan.loanStatus === 'Completed' ? 'status-success' : 'status-failed'
                  }
                >
                  {loan.loanStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
