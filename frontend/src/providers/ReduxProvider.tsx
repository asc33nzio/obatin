import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import PropagateLoad from '@/components/molecules/loaders/PropagateLoad';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<PropagateLoad />}>
        {children}
      </PersistGate>
    </Provider>
  );
}
