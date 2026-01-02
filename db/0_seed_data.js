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

// Ensure users collection has an unique index on loginId
try {
    db.users.createIndex({loginId: 1}, {unique: true});
    db.users.createIndex({username: 1});
} catch (e) {
    print('[init] users へのインデックス追加に失敗しました:', e.message);
}

// Ensure tabs collection has indexes
try {
    db.tabs.createIndex({userId: 1});
    db.tabs.createIndex({name: 1});
    db.tabs.createIndex({visibility: 1});
    db.tabs.createIndex({updatedAt: 1});
} catch (e) {
    print('[init] tabs へのインデックス追加に失敗しました:', e.message);
}

// Ensure favorite_tabs collection has indexes
try {
    db.favorite_tabs.createIndex({userId: 1, createdAt: -1});
    db.favorite_tabs.createIndex({userId: 1, tabId: 1}, {unique: true});
} catch (e) {
    print('[init] favorite_tabs へのインデックス追加に失敗しました:', e.message);
}

// Ensure tab_histories collection has indexes
try {
    db.tab_histories.createIndex({tabId: 1});
    db.tab_histories.createIndex({version: 1});
    db.tab_histories.createIndex({tabId: 1, version: 1}, {unique: true});
} catch (e) {
    print('[init] tab_histories へのインデックス追加に失敗しました:', e.message);
}

// Ensure tab_summaries collection has indexes
try {
    db.tab_summaries.createIndex({tabId: 1}, {unique: true});
    db.tab_summaries.createIndex({viewCount: 1});
    db.tab_summaries.createIndex({favoriteCount: 1});
} catch (e) {
    print('[init] tab_summaries へのインデックス追加に失敗しました:', e.message);
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

// Seed default user if not exists
(function seedUser() {
    let existing = db.users.findOne({loginId: 'testuser'});
    if (existing) {
        print('[init] users: 既に登録済みのユーザーのためスキップします');
        return;
    }

    [
        {loginId: 'user1', username: 'テストユーザー1'},
        {loginId: 'user2', username: 'テストユーザー2'},
        {loginId: 'user3', username: 'テストユーザー3'}
    ].forEach(user => {
        // bcrypt hash for string 'password'
        db.users.insertOne({
            loginId: user.loginId,
            username: user.username,
            hashedPassword: '$2b$10$T4UlyI7zQvKeqYb0DX.Xre6rOngHAEpkFZE9hdU6H/p8oO.N3/GUm',
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    })

    print('[init] users: デフォルトのユーザーを登録しました (loginId=user, password=password)');
})();

// Seed default tabs if not exists
(function seedTabs() {
    let user1 = db.users.findOne({loginId: 'user1'});
    if (!user1) {
        print('[init] tabs: user1 が見つからないため、タブ譜の登録をスキップします');
        return;
    }

    const date = new Date();
    const yyyymmdd = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');

    let tabs = [
        {
            userId: user1._id,
            name: 'ギタークロマチック',
            visibility: 'public',
            bpm: 120,
            tracks: [
                {
                    name: 'Guitar',
                    instrument: 'Electric Guitar Clean',
                    tuning: 'E4 B3 G3 D3 A2 E2',
                    isVisible: true,
                    tex: '1.6 2.6 3.6 4.6 |\n' +
                        '1.5 2.5 3.5 4.5 |\n' +
                        '1.4 2.4 3.4 4.4 |\n' +
                        '1.3 2.3 3.3 4.3 |\n' +
                        '1.2 2.2 3.2 4.2 |\n' +
                        '1.1 2.1 3.1 4.1 |\n' +
                        '4.1 3.1 2.1 1.1 |\n' +
                        '4.2 3.2 2.2 1.2 |\n' +
                        '4.3 3.3 2.3 1.3 |\n' +
                        '4.4 3.4 2.4 1.4 |\n' +
                        '4.5 3.5 2.5 1.5 |\n' +
                        '4.6 3.6 2.6 1.6'
                }
            ],
            alphaTabVersion: '1.7.1',
            version: yyyymmdd + '-001',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            userId: user1._id,
            name: 'ベースクロマチック',
            visibility: 'public',
            bpm: 120,
            tracks: [
                {
                    name: 'Bass',
                    instrument: 'Electric Bass Finger',
                    tuning: 'G2 D2 A1 E1',
                    isVisible: true,
                    tex: '1.4 2.4 3.4 4.4 |\n' +
                        '1.3 2.3 3.3 4.3 |\n' +
                        '1.2 2.2 3.2 4.2 |\n' +
                        '1.1 2.1 3.1 4.1 |\n' +
                        '4.1 3.1 2.1 1.1 |\n' +
                        '4.2 3.2 2.2 1.2 |\n' +
                        '4.3 3.3 2.3 1.3 |\n' +
                        '4.4 3.4 2.4 1.4 |'
                }
            ],
            alphaTabVersion: '1.7.1',
            version: yyyymmdd + '-001',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            userId: user1._id,
            name: 'メジャースケール',
            visibility: 'public',
            bpm: 120,
            tracks: [
                {
                    name: 'Guitar',
                    instrument: 'Electric Guitar Clean',
                    tuning: 'E4 B3 G3 D3 A2 E2',
                    isVisible: true,
                    tex: '3.5 5.5 2.4 3.4 |\n' +
                        '5.4 2.3 4.3 5.3 |\n' +
                        '5.3 4.3 2.3 5.4 |\n' +
                        '3.4 2.4 5.5 3.5\n'
                },
                {
                    name: 'Bass',
                    instrument: 'Electric Bass Finger',
                    tuning: 'G2 D2 A1 E1',
                    isVisible: true,
                    tex: '3.3 5.3 2.2 3.2 |\n' +
                        '5.2 2.1 4.1 5.1 |\n' +
                        '5.1 4.1 2.1 5.2 |\n' +
                        '3.2 2.2 5.3 3.3\n'
                }
            ],
            alphaTabVersion: '1.7.1',
            version: yyyymmdd + '-001',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    tabs.forEach(tab => {
        let existing = db.tabs.findOne({userId: tab.userId, name: tab.name});
        if (existing) {
            print(`[init] tabs: 既に登録済みのタブ譜のためスキップします (name=${tab.name})`);
            return;
        }

        db.tabs.insertOne(tab);
        let inserted = db.tabs.findOne({userId: tab.userId, name: tab.name});
        db.tab_histories.insertOne({
            ...tab,
            tabId: inserted._id,
            version_comment: '新規登録'
        });
        db.tab_summaries.insertOne({
            tabId: inserted._id,
            viewCount: 0,
            favoriteCount: 0
        });
        print(`[init] tabs: デフォルトのタブ譜を登録しました (name=${tab.name})`);
    });
})();
