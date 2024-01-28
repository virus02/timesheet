import { run } from '../../services/mongodb';

export async function activityList(req, res) {
  try {
    let result = await run('timesheet', 'activities', 'all', []);
    result.forEach(ele => {
      delete ele['_id'];
    });
    console.log(result);
    res.status(200).json(result);
  } catch(err) {
    console.log(err);
  }
}

export async function createActivity(req, res) {
  try {
    const data = req.body;

    await run('timesheet', 'activities', 'insertOne', data);

    res.status(200).send({status: "success"});
  } catch(err) {
    console.log(err)
  }
}

export async function getActivity(req, res) {
  try {
    const { name } = req.query;

    const project = await run('timesheet', 'activities', 'find', {name: name});
    delete project['_id'];
    
    res.status(200).json({status: 'success', details: project});
  } catch(err) {
    console.log(err);
  }
}

export async function editActivity(req, res) {
  try {
    const data = req.body;

    await run('timesheet', 'activities', 'updateOne', data);

    res.status(200).json({status: 'success'});
  } catch(err) {
    console.log(err);
  }
}