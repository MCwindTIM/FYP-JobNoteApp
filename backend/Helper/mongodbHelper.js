const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

module.exports = class MongoDBHelper {
    constructor(options) {
        this.uri = options.uri;
        this.client = new MongoClient(this.uri);
        this.databaseName = options.databaseName;
        this.dataCollectionName = options.dataCollectionName;
        this.client.connect();
    }

    async insert(data) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.insertOne(data);
    }

    async find(query, projection, sort) {
        if (!projection) projection = {};
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        if (!sort) {
            return await collection.find(query, projection).toArray();
        } else {
            return await collection
                .find(query, projection)
                .sort(sort)
                .toArray();
        }
    }

    async findOne(query, projection) {
        if (projection === null || projection === undefined || !projection) {
            projection = {};
        }
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.findOne(query, projection);
    }

    async update(query, data) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.updateOne(query, data);
    }

    async delete(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.deleteOne(query);
    }

    async deleteMany(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.deleteMany(query);
    }

    async count(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.count(query);
    }

    async aggregate(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.aggregate(query).toArray();
    }

    async distinct(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.distinct(query);
    }

    async findOneAndUpdate(query, data) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.findOneAndUpdate(query, data);
    }

    async findOneAndDelete(query) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.findOneAndDelete(query);
    }

    async findOneAndReplace(query, data) {
        const db = this.client.db(this.databaseName);
        const collection = db.collection(this.dataCollectionName);
        return await collection.findOneAndReplace(query, data);
    }

    //↑↑↑↑↑ API ↑↑↑↑↑ ↓↓↓↓↓ Admin web management System ↓↓↓↓↓
    //get User by username
    async getUserByUsername(username) {
        try {
            return await this.client
                .db(this.databaseName)
                .collection(this.dataCollectionName)
                .find({ username: username })
                .toArray();
        } catch (e) {
            console.error(e);
        }
    }

    //get Job count
    async getCollectionCount() {
        try {
            return await this.client
                .db(this.databaseName)
                .collection(this.dataCollectionName)
                .countDocuments();
        } catch (e) {
            console.error(e);
        }
    }

    //fetch job by id
    getJobById = async (id) => {
        id = new ObjectId(id);
        try {
            return await this.client
                .db(this.databaseName)
                .collection(this.dataCollectionName)
                .find({ _id: id })
                .toArray();
        } catch (e) {
            console.error(e);
        }
    };

    //fetch all job data
    getAllJobData = async () => {
        try {
            return await this.client
                .db(this.databaseName)
                .collection(this.dataCollectionName)
                .find()
                .toArray();
        } catch (e) {
            console.error(e);
        }
    };
};
