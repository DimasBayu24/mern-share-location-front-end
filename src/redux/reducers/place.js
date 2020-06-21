const initialValue = {
  placeData: [],
  errMsg: [],
  isPending: false,
  isRejected: false,
  isFulfilled: false,
};

const placeReducers = (state = initialValue, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'GET_USER_PENDING':
      return {
        ...state,
        isPending: true,
        isRejected: false,
        isFulfilled: false,
      };
    case 'GET_USER_REJECTED':
      return {
        ...state,
        isPending: false,
        isRejected: true,
        errMsg: action.payload.data,
      };
    case 'GET_USER_FULFILLED':
      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        placeData: action.payload.data,
      };
    default:
      return state;
  }
};

export default placeReducers;
