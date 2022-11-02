import Stripe from 'stripe';
const stripe = new Stripe('ssk_test_51LzAupLTMDQ2GHFnvQW4fi7Mt8TxOpbxyuyURKS3ZGiEbEbvKCYNdDBEhA8IuYQr2XTCyJrsQrAwDZqUATqpO9Bk00uozWlXiI', {
  apiVersion: '2022-08-01',
});

const createCustomer = async () => {
  const params: Stripe.CustomerCreateParams = {
    description: 'test customer',
  };

  const customer: Stripe.Customer = await stripe.customers.create(params);

  console.log(customer.id);
};
createCustomer();