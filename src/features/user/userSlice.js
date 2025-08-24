import { createSlice } from '@reduxjs/toolkit';

// Helper function to load initial state
const loadInitialState = () => {
  // Check localStorage first (for "remember me" users)
  const localStorageUser = localStorage.getItem('userInfo');
  // console.log("localStorageUser", localStorageUser)
  if (localStorageUser) {
    return { userInfo: typeof localStorageUser === 'string' ? JSON.parse(localStorageUser) : localStorageUser, token: localStorage.getItem('token') };
  }
  
  const sessionStorageUser = sessionStorage.getItem('userInfo');
  // console.log("sessionStorageUser", sessionStorage.getItem('userInfo'))
  if (sessionStorageUser) {
    return { userInfo: typeof sessionStorageUser === 'string' ? JSON.parse(sessionStorageUser) : sessionStorageUser, token: sessionStorage.getItem('token') };
  }
  
  // Default initial state
  return { userInfo: null, token: null };
};

const initialState = loadInitialState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      // Store based on rememberMe flag
      if (action.payload.rememberMe) {
        localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
        localStorage.setItem('token', action.payload.token);
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
        sessionStorage.setItem('token', action.payload.token);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    },
    clearUser(state) {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   userInfo: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       state.userInfo = action.payload;
//     },
//     clearUser(state) {
//       state.userInfo = null;
//     },
//   },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;
