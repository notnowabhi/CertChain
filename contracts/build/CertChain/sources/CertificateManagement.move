module 0x0d1b41c5093567f294abd60eef117e68158f33ccad68d6ce5a347f3f5a2d004e::CertificateManagement {

    use aptos_framework::signer;
    use std::string;
    use std::vector;

    struct Certificate has key, store {
        certificate_id: u64,
        institution: address,
        recipient: address,
        title: string::String,
        issued_at: u64,
    }

    struct CertChainStore has key {
        certificates: vector<Certificate>,
    }

    public fun issue_certificate(
        account: &signer, 
        certificate_id: u64, 
        recipient: address, 
        title: string::String, 
        issued_at: u64
    ) acquires CertChainStore {
        let institution = signer::address_of(account);
        let store = borrow_global_mut<CertChainStore>(institution);
        let certificate = Certificate {
            certificate_id,
            institution,
            recipient,
            title,
            issued_at,
        };
        vector::push_back(&mut store.certificates, certificate);
    }

    public fun verify_certificate(account: address, certificate_id: u64): bool acquires CertChainStore {
        let store = borrow_global<CertChainStore>(account);
        let certs = &store.certificates;
        let length = vector::length(certs);

        for (i in 0..length) {
            let cert = vector::borrow(certs, i);
            if (cert.certificate_id == certificate_id) {
                return true // Return true if found
            }
        };
        return false // Explicitly return false if not found
    }

    public fun initialize(account: &signer) {
        let _institution = signer::address_of(account);
        move_to(account, CertChainStore {
            certificates: vector::empty(),
        });
    }
}
