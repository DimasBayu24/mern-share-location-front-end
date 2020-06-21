import Axios from 'axios';

export const getUser = () => {
  return {
    type: 'GET_USER',
    payload: Axios.get('https://learn-mernstack.herokuapp.com/api/users'),
  };
};
