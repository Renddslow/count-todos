# count-todos
> Count all todo's in your repository

## Install
```
$ yarn add count-todos
```

## Usage
```
// example.js
const countTodos = require('count-todos');

console.log(countTodos());
//=> 2 
```

## API

count-todos expects that your `TODO` comments are followed by a colon and a whitespace character. Examples of TODO's that will match:

```
// TODO: This thing needs fixing

/* Todo: Fix this thing */

/**
  * todo: This is a problem
  *
  **/ 
```

### countTodos([filePath], [options])
Returns a `number` based on a grep of the repository excluding by default `node_modules`, `flow-typed`, `.idea`, `.vscode`, and `.git`.

#### filePath
- Type: `string`
- Default: `process.cwd()`

Optionally pass in the path to the repository you wish to count.

#### options
- Type: `object`

| Name | Type | Description | Default 
| --- | --- | --- | ---
| `exclude` | `Array<string>` | A list of directories to exclude from the search. List is added to the list of defaults | `[]`
| `fileTypes` | `Array<string>` | A list of file types to ignore, eg `[.md, .jpg, .txt]` | `[]`
| `verbose` | `boolean` | Whether or not the grep search command should be printed | `false`

## License
MIT © Matt McElwee


