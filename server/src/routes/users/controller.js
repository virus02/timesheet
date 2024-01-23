import { run } from '../../services/mongodb';
const bcrypt = require('bcrypt');

const saltRounds = 10;

export async function createUser(req, res) {
  try {
    const data = req.body;

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    await run('timesheet', 'users', 'insertOne', data);
    await run('timesheet', 'user_auth', 'insertOne', {email: data.email, password: hashedPassword});

    res.status(200).send({status: "success"});
  } catch(err) {
    console.log(err)
  }
}

export async function getUser(req, res) {
  try {
    const { email } = req.query;

    const user = await run('timesheet', 'users', 'find', {email: email});
    delete user['_id'];
    
    res.status(200).json({status: 'success', details: user});
  } catch(err) {
    console.log(err);
  }
}

export async function editUser(req, res) {
  try {
    const data = req.body;

    await run('timesheet', 'users', 'updateOne', data);

    res.status(200).json({status: 'success'});
  } catch(err) {
    console.log(err);
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