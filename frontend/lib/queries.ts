import { gql } from '@apollo/client/core';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id name email role country }
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id name cuisine country imageUrl
      menuItems { id name description price category }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder {
    createOrder { id status totalAmount items { id quantity price menuItem { name } } }
  }
`;

export const ADD_ITEM = gql`
  mutation AddItem($orderId: Int!, $menuItemId: Int!, $quantity: Int!) {
    addItemToOrder(orderId: $orderId, menuItemId: $menuItemId, quantity: $quantity) {
      id status totalAmount
      items { id quantity price menuItem { id name price } }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($orderId: Int!, $paymentMethodId: Int!) {
    placeOrder(orderId: $orderId, paymentMethodId: $paymentMethodId) {
      id status totalAmount
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: Int!) {
    cancelOrder(orderId: $orderId) { id status }
  }
`;

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id status totalAmount createdAt paymentMethodId
      items { id quantity price menuItem { name } }
    }
  }
`;

export const ALL_PAYMENT_METHODS = gql`
  query AllPaymentMethods {
    allPaymentMethods { id type last4 holderName userId user { name role } }
  }
`;

export const MY_PAYMENT_METHODS = gql`
  query MyPaymentMethods {
    myPaymentMethods { id type last4 holderName }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($type: String!, $last4: String!, $holderName: String!) {
    addPaymentMethod(type: $type, last4: $last4, holderName: $holderName) {
      id type last4 holderName
    }
  }
`;

export const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($id: Int!, $type: String!, $last4: String!, $holderName: String!) {
    updatePaymentMethod(id: $id, type: $type, last4: $last4, holderName: $holderName) {
      id type last4 holderName
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: Int!) {
    deletePaymentMethod(id: $id) { id }
  }
`;
