import { MongoClient } from "mongodb";

const uri = "mongodb+srv://<username>:<password>@mycluster.irixgov.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export async function run(db, col, operation, doc) {
  try {
    const database = client.db(db);
    const collection = database.collection(col);
    let result;

    if (operation == 'insertOne') {
      result = await collection.insertOne(doc);
    } else if (operation == 'all') {
      result = await collection.find({}).toArray();
    }

    console.log(`Job completed`);
    return result;
  } catch(err) {
    await client.close();
    console.log(err);
  }
}