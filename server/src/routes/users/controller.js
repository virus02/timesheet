import { run } from '../../services/mongodb';

export async function createUser(req, res) {
  try {
    const data = req.body;
    await run('timesheet', 'users', 'insertOne', data);
    res.status(200).send({status: "success"});
  } catch(err) {
    console.log(err)
  }
}

export async function userList(req, res) {
  try {
    let result = await run('timesheet', 'users', 'all', []);
    result.forEach(ele => {
      delete ele['_id'];
    });
    res.status(200).send(result);
  } catch(err) {
    console.log(err);
  }
}