const { MongoClient, ObjectId } = require('mongodb');

class DB {
    db_uri;
    db_name;
    client;

    constructor() {
        this.db_uri = process.env.DB_URI;
        this.db_name = process.env.DB_NAME;
        this.client = new MongoClient(this.db_uri);
    }

    async FindAll(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).find(query, project).toArray();
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async FindOne(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            // console.log(collection, query, project,'<< pr ')
            const res = await this.client.db(this.db_name).collection(collection).findOne(query, project);
            // console.log(res,'<< res pr ')
            return res
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async Insert(collection, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).insertOne(doc);
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async UpdateById(collection, id, doc) {
        try {
            await this.client.connect();
            // console.log({...doc});
            delete doc._id;
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: {...doc} });
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async UpdateOne(collection, matchCondition, doc) {
        try {
            await this.client.connect();
            // console.log({...doc},'<< host');
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { ...matchCondition },
                { $set: {...doc} });
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }
    async DeleteById(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).deleteOne(
                { _id: new ObjectId(id) });
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }


    async GetNextId(collection) {
        try {
            await this.client.connect();
            const res =  await this.client.db(this.db_name).collection(collection).find({}).toArray();
            const max = Math.max(...(res.map(et=>et.id)));
            return max+1;
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

}

module.exports = DB;
