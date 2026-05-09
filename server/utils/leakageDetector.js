const calculateLeakage = (subscription) => {
  const today = new Date();
  const lastUsed = new Date(subscription.lastUsedDate);
  const unusedDays = Math.floor((today - lastUsed) / (1000 * 60 * 60 * 24));
  const leakageScore = subscription.monthlyCost * unusedDays;

  let priority = 'Active';
  let color = 'green';

  if (unusedDays > 30 && subscription.monthlyCost > 500) {
    priority = 'High';
    color = 'red';
  } else if (unusedDays > 30) {
    priority = 'Medium';
    color = 'orange';
  }

  return {
    ...subscription._doc,
    unusedDays,
    leakageScore,
    priority,
    color
  };
};

module.exports = { calculateLeakage };