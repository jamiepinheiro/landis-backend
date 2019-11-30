const cors = require("cors")({origin: true});
import { db } from '.';
import { CreateAccountRequest } from './models/createAccountRequest';
import { UpdateAccountRequest } from './models/updateAccountRequest';
import { Account } from './models/account'

const functions = require('firebase-functions');

export const allAccounts = functions.https.onRequest((request: any, response: any) => {
    cors(request, response, () => {
        if (request.method === 'GET') {
            getAllAccounts().then((accs: Account[]) => {
                response.send(accs);
            }).catch((err: any) => {
                response.status(400).send(err);
            });
        }
    });
});

export const account = functions.https.onRequest((request: any, response: any) => {
    cors(request, response, () => {
        if (request.method === 'POST') {
            createAccount(request.body).then((acc: Account) => {
                response.send(acc);
            }).catch((err: any) => {
                response.status(400).send(JSON.stringify(err));
            });
        } else if (request.method === 'GET') {
            getAccount(Number.parseInt(request.query.accountToken)).then((acc: Account) => {
                response.send(acc);
            }).catch((err: any) => {
                response.status(400).send(err);
            });
        } else if (request.method === 'PUT') {
            updateAccount(request.body).then((acc: Account) => {
                response.send(acc);
            }).catch((err: any) => {
                response.status(400).send(err);
            })
        } else if (request.method === 'DELETE') {
            deleteAccount(Number.parseInt(request.query.accountToken)).then((acc: Account) => {
                response.send(acc);
            }).catch((err: any) => {
                response.status(400).send(err);
            });
        } else {
            return response.status(400).send('Please send a supported request type.')
        }
    });
});

async function getAllAccounts(): Promise<Account[]> {
    try {
        const results = await db.collection('accounts')
            .where('active', '==', true)
            .get()

        const accounts: Account[] = [];
        results.forEach((r: any) => accounts.push(r.data()));
        return accounts;
    } catch(e) {
        console.log(e);
        throw e
    }
};

async function createAccount(createAccountRequest: CreateAccountRequest): Promise<Account> {
    try {
        const acc: Account = new Account(
            true, // active
            createAccountRequest.address,
            createAccountRequest.balance,
            createAccountRequest.comments,
            createAccountRequest.created,
            createAccountRequest.credit,
            createAccountRequest.email,
            createAccountRequest.employer,
            createAccountRequest.name_first,
            createAccountRequest.name_last,
            createAccountRequest.picture,
            createAccountRequest.tags
        );
        const newAccount = await db.collection('accounts').add(acc.toWire());
        const doc = await newAccount.get();
        return doc.data();
    } catch(e) {
        console.log(e);
        throw e
    }
};

async function getAccount(accountToken: number): Promise<Account>{
    try {
        const accounts = await db.collection('accounts')
            .where('token', '==', accountToken)
            .limit(1)
            .get()
        return accounts.docs[0].data();
    } catch(e) {
        console.log(e);
        throw e
    }
};

async function updateAccount(updateAccountRequest: UpdateAccountRequest): Promise<Account> {
    try {
        const accounts = await db.collection('accounts')
            .where('token', '==', updateAccountRequest.accountToken)
            .limit(1)
            .get()
        const id = accounts.docs[0].id;
        await db.collection('accounts').doc(id).update(updateAccountRequest);
        return getAccount(updateAccountRequest.accountToken);
    } catch(e) {
        console.log(e);
        throw e
    }
};

async function deleteAccount(accountToken: number): Promise<Account> {
    return updateAccount({
        accountToken,
        active: false
    });
};
