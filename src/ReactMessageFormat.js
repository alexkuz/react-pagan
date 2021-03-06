import React from 'react';
import IntlMessageFormat from 'intl-messageformat';

export default class ReactMessageFormat extends IntlMessageFormat {
  _format(pattern, values) {
    let result = [], part, id, value;
    const { props, renderComponent, renderString, getValue } = values;

    for (let i = 0, len = pattern.length; i < len; i += 1) {
      part = pattern[i];

      if (typeof part === 'string') {
        result.push(renderString(part, i));
        continue;
      }

      id = part.id;

      value = getValue(id, props);

      if (React.isValidElement(value)) {
        result.push(value);
      } else if (part.options) {
        result.push(renderComponent(id, this._format(part.getOption(value), values), i));
      } else {
        result.push(renderComponent(id, part.format(value), i));
      }
    }

    return result;
  }
}
