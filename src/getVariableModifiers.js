export default function getVariableModifiers(cb, separator='|') {
  return (id, ...args) => {
    let [varName, ...modifiers] = id.split(separator);
    return cb(varName, modifiers, ...args);
  }
}
