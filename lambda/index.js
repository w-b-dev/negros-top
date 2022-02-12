const dotEnv = require("dotenv").config();
const { Client, mapping, types } = require("cassandra-driver");

async function getArtistas() {
    const client = new Client({
        cloud: {
            secureConnectBundle: process.env.ASTRADB_SECURE_BUNDLE,
        },
        credentials: {
            username: process.env.ASTRADB_CLIENT_ID,
            password: process.env.ASTRADB_CLIENT_SECRET,
        },
    });
    // const mapper = new mapping.Mapper(client, {
    //     models: { 'Artistas': { tables: ['artistas'] } }
    // });
    // const artistasMapper = mapper.forModel('Artistas');

    await client.connect();

    // Execute a query
    const rs = await client.execute("SELECT * FROM system.local");
    await client.shutdown();
    return ({
        mensagem: `Your cluster returned ${rs.rowLength} row(s)`
    })
}

async function postArtistas(requestPayload) {
    const client = new Client({
        cloud: {
            secureConnectBundle: "negros-top.zip",
        },
        keyspace: 'artists',
        credentials: {
            username: "KGlZJWsmHIFvjRceGIDNCfrM",
            password: "C--4bO+loLrrU1lIzgWOwllFwnlCZPIthWDaBj4+szKC64XTzGenFsyAiiSLKplo0CpJ,s6+,-hjMFuY,ut_HL+ISU8ifrnrC4lLOWf,YLX5UQcY+P1sl77xLigEEGZz",
        },
    });
    try {
        await client.connect();
    } catch (e) {
        return ({
            onde: 'await client.connect();',
            erro: e
        })
    }
    /*First things first... Let's create a DB (if it does not exist yet) */
    const createTableIfNotExists = `CREATE TABLE IF NOT EXISTS artistas
        (
            name  TEXT, id UUID,
            PRIMARY KEY ((id), name)
        );`
    try {
        await client.execute(createTableIfNotExists);
    } catch (e) {
        return ({
            onde: 'await client.execute(createTableIfNotExists);',
            erro: e
        })
    }
    /* We should have a DB with a TABLE ready now */
    const mapper = new mapping.Mapper(client, {
        models: {
            'Artistas': {
                tables: ['artistas'], keyspace: 'artists', columns: {
                    name: 'name', id: 'id'
                }
            }
        },
    });
    // https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/mapper/getting-started/
    // A ModelMapper contains all the logic to retrieve and save objects from and to the database.
    const artistasMapper = mapper.forModel('Artistas');
    // Generate an UUID for the entry to be created in the db
    const Uuid = types.Uuid;
    const id = Uuid.random();
    /* TODO: requestPayload should be {name: 'Ella Fitzgerald'} */
    try {
        await artistasMapper.insert({ ...requestPayload, id: id });
    } catch (e) {
        return ({
            onde: 'await artistasMapper.insert({...requestPayload, id: id});',
            erro: e
        })
    }
    /* TODO: result should be request + `id: uuid()` */
    try {
        const result = await artistasMapper.get({ id: id, name: requestPayload.name });
        await client.shutdown();
        return ({
            artista: result
        })
    } catch (e) {
        return ({
            onde: 'await artistasMapper.get...',
            erro: e
        })
    }
}

exports.handler = async (event) => {
    // Identificar qual HTTP VERB entrou: GET, POST ou outro
    const httpMethod = event.httpMethod;
    // Oferecer logica para o GET
    if (httpMethod === 'GET') {
        // Run the async function
        const response = await getArtistas();
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    }

    // Oferecer logica para o POST
    if (httpMethod === 'POST') {
        // Capturar o body que vem como STRING -- queremos Object
        const body = event.body;
        // Run the async function
        const response = await postArtistas(body);
        return {
            statusCode: 200,
            body: response,
        };
    }
    // Rejeitar qualquer outro HTTP VERB
    return {
        statusCode: 403,
        body: "METODO NAO SUPORTADO",
    };
};