// MongoDB initialization script
// This script is executed by the official MongoDB image on first startup
// when the data directory is empty. You can append more seed data below.

// Switch to target database
db = db.getSiblingDB('play-tab');

// Ensure administrators collection has an unique index on loginId
try {
    db.administrators.createIndex({loginId: 1}, {unique: true});
} catch (e) {
    // Index creation may fail if already exists; log and continue
    print('[init] administrators へのインデックス追加に失敗しました:', e.message);
}

// Ensure sessions collection has an index on sessionId
try {
    db.sessions.createIndex({sessionId: 1}, {unique: true});
} catch (e) {
    print('[init] sessions へのインデックス追加に失敗しました:', e.message);
}

// Seed default administrator if not exists
(function seedAdministrator() {
    let existing = db.administrators.findOne({loginId: 'admin'});
    if (existing) {
        print('[init] administrators: 既に登録済みの管理者のためスキップします');
        return;
    }

    // bcrypt hash for string 'password'
    // Note: This is a precomputed bcrypt hash. Application side uses bcrypt.compare() to verify.
    db.administrators.insertOne({
        loginId: 'admin',
        hashedPassword: '$2b$10$T4UlyI7zQvKeqYb0DX.Xre6rOngHAEpkFZE9hdU6H/p8oO.N3/GUm',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    print('[init] administrators: デフォルトの管理者を登録しました (loginId=admin, password=password)');
})();
