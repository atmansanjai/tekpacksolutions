import { Environment, MutableRecordSource } from "relay-runtime";

export function resetRelayEnvironment(env: Environment): void {
    const store = env.getStore();
    const source = store.getSource() as MutableRecordSource;
    source.clear();
    store.notify();
}
