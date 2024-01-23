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
    } else if (operation == 'find') {
      const query = { email: doc.email };
      result = await collection.findOne(query)
    } else if (operation == 'updateOne') {
      console.log(doc);
      result = await collection.findOneAndUpdate(
        {email: doc.email},
        {$set: doc},
        {new: true}  
      );
    }

    console.log(`Job completed`);
    return result;
  } catch(err) {
    await client.close();
    console.log(err);
  }
}