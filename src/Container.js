
import { useState } from 'react';
import { createContainer } from 'react-tracked';

const useValue = () => useState({
  accountId: null,
  accountName: null,
});

export const { Provider: StateProvider, useTracked } = createContainer(useValue);