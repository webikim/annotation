type NumberUndefined = number | undefined;

type AppDispatch = typeof store.dispatch
type RootState = ReturnType<typeof rootReducer>;
type GetState = () => RootState;