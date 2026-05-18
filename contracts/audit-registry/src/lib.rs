#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EventType {
    ModelRegistered,
    InferenceLogged,
    VersionUpdated,
    BiasDetected,
    DataProvenance,
    AuditCompleted,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Critical,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ModelRecord {
    pub model_id: u64,
    pub name: String,
    pub version: String,
    pub operator: Address,
    pub weights_hash: String,
    pub training_data_cid: String,
    pub registered_at: u64,
    pub audit_count: u32,
    pub risk_level: RiskLevel,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AuditEvent {
    pub event_id: u64,
    pub model_id: u64,
    pub event_type: EventType,
    pub operator: Address,
    pub payload_hash: String,
    pub risk_level: RiskLevel,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RegistryStats {
    pub total_models: u64,
    pub total_events: u64,
    pub high_risk_flags: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RegistryState {
    pub admin: Address,
    pub model_count: u64,
    pub event_count: u64,
    pub version: u32,
}

#[contracttype]
pub enum DataKey {
    State,
    Model(u64),
    Event(u64),
    Stats,
}

#[contract]
pub struct AuditRegistryContract;

#[contractimpl]
impl AuditRegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::State) {
            panic!("Already initialized");
        }
        admin.require_auth();
        let state = RegistryState {
            admin: admin.clone(),
            model_count: 0,
            event_count: 0,
            version: 1,
        };
        let stats = RegistryStats {
            total_models: 0,
            total_events: 0,
            high_risk_flags: 0,
        };
        env.storage().instance().set(&DataKey::State, &state);
        env.storage().instance().set(&DataKey::Stats, &stats);
        env.events().publish((symbol_short!("init"),), (admin,));
    }

    pub fn register_model(
        env: Env,
        operator: Address,
        name: String,
        version: String,
        weights_hash: String,
        training_data_cid: String,
    ) -> u64 {
        operator.require_auth();
        let mut state: RegistryState = env.storage().instance()
            .get(&DataKey::State).expect("Not initialized");

        let model_id = state.model_count + 1;
        let record = ModelRecord {
            model_id,
            name: name.clone(),
            version,
            operator: operator.clone(),
            weights_hash,
            training_data_cid,
            registered_at: env.ledger().timestamp(),
            audit_count: 0,
            risk_level: RiskLevel::Low,
        };

        env.storage().persistent().set(&DataKey::Model(model_id), &record);
        state.model_count = model_id;
        env.storage().instance().set(&DataKey::State, &state);

        let mut stats: RegistryStats = env.storage().instance()
            .get(&DataKey::Stats).unwrap();
        stats.total_models += 1;
        env.storage().instance().set(&DataKey::Stats, &stats);

        env.events().publish(
            (symbol_short!("register"),),
            (model_id, operator, name),
        );
        model_id
    }

    pub fn log_inference(
        env: Env,
        operator: Address,
        model_id: u64,
        payload_hash: String,
        risk: RiskLevel,
    ) -> u64 {
        operator.require_auth();
        let mut state: RegistryState = env.storage().instance()
            .get(&DataKey::State).expect("Not initialized");

        let event_id = state.event_count + 1;
        let is_high_risk = matches!(risk, RiskLevel::High | RiskLevel::Critical);

        let event = AuditEvent {
            event_id,
            model_id,
            event_type: EventType::InferenceLogged,
            operator: operator.clone(),
            payload_hash,
            risk_level: risk.clone(),
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Event(event_id), &event);
        state.event_count = event_id;
        env.storage().instance().set(&DataKey::State, &state);

        let mut stats: RegistryStats = env.storage().instance()
            .get(&DataKey::Stats).unwrap();
        stats.total_events += 1;
        if is_high_risk { stats.high_risk_flags += 1; }
        env.storage().instance().set(&DataKey::Stats, &stats);

        env.events().publish(
            (symbol_short!("infer"),),
            (event_id, model_id, operator),
        );
        event_id
    }

    pub fn flag_bias(
        env: Env,
        auditor: Address,
        model_id: u64,
        evidence_hash: String,
    ) -> u64 {
        auditor.require_auth();
        let mut state: RegistryState = env.storage().instance()
            .get(&DataKey::State).expect("Not initialized");

        let event_id = state.event_count + 1;
        let event = AuditEvent {
            event_id,
            model_id,
            event_type: EventType::BiasDetected,
            operator: auditor.clone(),
            payload_hash: evidence_hash,
            risk_level: RiskLevel::Critical,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Event(event_id), &event);
        state.event_count = event_id;
        env.storage().instance().set(&DataKey::State, &state);

        let mut stats: RegistryStats = env.storage().instance()
            .get(&DataKey::Stats).unwrap();
        stats.total_events += 1;
        stats.high_risk_flags += 1;
        env.storage().instance().set(&DataKey::Stats, &stats);

        env.events().publish(
            (symbol_short!("bias"),),
            (event_id, model_id, auditor),
        );
        event_id
    }

    pub fn get_model(env: Env, model_id: u64) -> ModelRecord {
        env.storage().persistent()
            .get(&DataKey::Model(model_id))
            .expect("Model not found")
    }

    pub fn get_event(env: Env, event_id: u64) -> AuditEvent {
        env.storage().persistent()
            .get(&DataKey::Event(event_id))
            .expect("Event not found")
    }

    pub fn get_stats(env: Env) -> RegistryStats {
        env.storage().instance()
            .get(&DataKey::Stats).expect("Not initialized")
    }

    pub fn get_state(env: Env) -> RegistryState {
        env.storage().instance()
            .get(&DataKey::State).expect("Not initialized")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_full_audit_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(AuditRegistryContract, ());
        let client = AuditRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let operator = Address::generate(&env);
        let auditor = Address::generate(&env);

        client.initialize(&admin);

        let model_id = client.register_model(
            &operator,
            &String::from_str(&env, "LLM-70B-Audit"),
            &String::from_str(&env, "v2.1.0"),
            &String::from_str(&env, "sha256:abc123def456"),
            &String::from_str(&env, "QmTrainingData001"),
        );
        assert_eq!(model_id, 1);

        let event_id = client.log_inference(
            &operator,
            &model_id,
            &String::from_str(&env, "sha256:inference_payload_hash"),
            &RiskLevel::Low,
        );
        assert_eq!(event_id, 1);

        let _bias_id = client.flag_bias(
            &auditor,
            &model_id,
            &String::from_str(&env, "sha256:bias_evidence_001"),
        );

        let stats = client.get_stats();
        assert_eq!(stats.total_models, 1);
        assert_eq!(stats.total_events, 2);
        assert_eq!(stats.high_risk_flags, 1);
    }
}
