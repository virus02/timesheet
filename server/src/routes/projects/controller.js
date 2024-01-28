import { run } from '../../services/mongodb';

export async function projectList(req, res) {
  try {
    let result = await run('timesheet', 'projects', 'all', []);
    result.forEach(ele => {
      delete ele['_id'];
    });
    console.log(result);
    res.status(200).json(result);
  } catch(err) {
    console.log(err);
  }
}

export async function createProject(req, res) {
  try {
    const data = req.body;

    await run('timesheet', 'projects', 'insertOne', data);

    res.status(200).send({status: "success"});
  } catch(err) {
    console.log(err)
  }
}

export async function getProject(req, res) {
  try {
    const { name } = req.query;

    const project = await run('timesheet', 'projects', 'find', {name: name});
    delete project['_id'];
    
    res.status(200).json({status: 'success', details: project});
  } catch(err) {
    console.log(err);
  }
}

export async function editProject(req, res) {
  try {
    const data = req.body;

    await run('timesheet', 'projects', 'updateOne', data);

    res.status(200).json({status: 'success'});
  } catch(err) {
    console.log(err);
  }
}