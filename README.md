Netlify link:https://67a391634abbe869ef583c7e--kanbanboard70.netlify.app/

In the project directory, you can run:

### `npm start`

Column Schema (Mongo schema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnSchema = new Schema({
  title: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('Column', columnSchema);

Task Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  dueTime: { type: Date, required: true },
  type: { type: String, required: true },
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true }
});

module.exports = mongoose.model('Task', taskSchema);

//This will be the schema of the data that will be stored in mongoDB
//And all the crud operations will be handled at each update like creating updating and deleting using the APIS
