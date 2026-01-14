#![allow(unexpected_cfgs)]
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct State {
    pub initialized: bool,
    pub admin: Address,
    pub version: u32,
}

#[contracttype]
pub enum DataKey {
    State,
    Counter,
}

#[contract]
pub struct UsageMeterContract;

#[contractimpl]
impl UsageMeterContract {
    pub fn initialize(env: Env, admin: Address) -> bool {
        if env.storage().instance().has(&DataKey::State) {
            panic!("Already initialized");
        }
        admin.require_auth();
        let state = State {
            initialized: true,
            admin: admin.clone(),
            version: 1,
        };
        env.storage().instance().set(&DataKey::State, &state);
        env.storage().instance().set(&DataKey::Counter, &0u32);
        env.events().publish(
            (symbol_short!("init"),),
            (admin,),
        );
        true
    }

    pub fn version(env: Env) -> u32 {
        let state: State = env.storage().instance().get(&DataKey::State)
            .expect("Not initialized");
        state.version
    }

    pub fn get_state(env: Env) -> State {
        env.storage().instance().get(&DataKey::State)
            .expect("Not initialized")
    }

    pub fn increment(env: Env, caller: Address) -> u32 {
        caller.require_auth();
        let count: u32 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        let new_count = count.checked_add(1).expect("Overflow");
        env.storage().instance().set(&DataKey::Counter, &new_count);
        new_count
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, UsageMeterContract);
        let client = UsageMeterContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        assert!(client.initialize(&admin));
        assert_eq!(client.version(), 1);
    }

    #[test]
    fn test_increment() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, UsageMeterContract);
        let client = UsageMeterContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        assert_eq!(client.increment(&admin), 1);
        assert_eq!(client.increment(&admin), 2);
        assert_eq!(client.get_count(), 2);
    }
}
