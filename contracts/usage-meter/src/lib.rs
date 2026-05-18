#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InferenceSession {
    pub session_id: u64,
    pub model_id: u64,
    pub operator: Address,
    pub started_at: u64,
    pub closed_at: u64,
    pub inference_count: u32,
    pub total_tokens: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MeterState {
    pub admin: Address,
    pub session_count: u64,
    pub total_inferences: u64,
    pub version: u32,
}

#[contracttype]
pub enum DataKey {
    State,
    Session(u64),
}

#[contract]
pub struct UsageMeterContract;

#[contractimpl]
impl UsageMeterContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::State) {
            panic!("Already initialized");
        }
        admin.require_auth();
        let state = MeterState { admin: admin.clone(), session_count: 0, total_inferences: 0, version: 1 };
        env.storage().instance().set(&DataKey::State, &state);
        env.events().publish((symbol_short!("init"),), (admin,));
    }

    pub fn start_session(env: Env, operator: Address, model_id: u64) -> u64 {
        operator.require_auth();
        let mut state: MeterState = env.storage().instance()
            .get(&DataKey::State).expect("Not initialized");
        let session_id = state.session_count + 1;
        let session = InferenceSession {
            session_id,
            model_id,
            operator: operator.clone(),
            started_at: env.ledger().timestamp(),
            closed_at: 0,
            inference_count: 0,
            total_tokens: 0,
        };
        env.storage().persistent().set(&DataKey::Session(session_id), &session);
        state.session_count = session_id;
        env.storage().instance().set(&DataKey::State, &state);
        env.events().publish((symbol_short!("session"),), (session_id, model_id, operator));
        session_id
    }

    pub fn get_session(env: Env, session_id: u64) -> InferenceSession {
        env.storage().persistent()
            .get(&DataKey::Session(session_id))
            .expect("Session not found")
    }

    pub fn get_state(env: Env) -> MeterState {
        env.storage().instance()
            .get(&DataKey::State).expect("Not initialized")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_session_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(UsageMeterContract, ());
        let client = UsageMeterContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let operator = Address::generate(&env);
        client.initialize(&admin);
        let session_id = client.start_session(&operator, &1u64);
        assert_eq!(session_id, 1);
        let session = client.get_session(&1u64);
        assert_eq!(session.model_id, 1);
    }
}
