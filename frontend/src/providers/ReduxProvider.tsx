import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { store } from '@/redux/store/store';

persistStore(store);

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
