import { RootStore } from '../types';

export const ROOT = (store: RootStore): RootStore => store;
export const TRADING = ({ trading }: RootStore): RootStore['trading'] => trading;
export const PHLEGMATIC = ({ phlegmatic }: RootStore): RootStore['phlegmatic'] => phlegmatic;
export const DEFAULTS = ({ phlegmatic }: RootStore): RootStore['phlegmatic']['defaults'] => phlegmatic.defaults;
