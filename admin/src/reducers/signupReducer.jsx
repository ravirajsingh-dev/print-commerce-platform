const initialState = {
  name: "",
  email: "",
  password: "",
  terms: false,
};

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_NAME":
      return {
        ...state,
        name: action.payload,
      };
    case "UPDATE_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "UPDATE_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };
    case "UPDATE_TERMS":
      return {
        ...state,
        terms: action.payload,
      };
    default:
      return state;
  }
};

export default signupReducer;
