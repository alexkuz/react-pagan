import React, { Component, PropTypes } from 'react';
import Format from '../Format';
import getVariableModifiers from '../getVariableModifiers';

export default class FormattedText extends Component {
  static propTypes = {
    text: PropTypes.string,
    i18n: PropTypes.shape({
      locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      formats: PropTypes.object
    }),
    values: PropTypes.object
  }

  render() {
    const { text, i18n, values } = this.props;
    return (
      <div className='panel panel-default'>
        <Format text={text}
                getValue={getVariableModifiers(id => values[id] !== undefined ? values[id] : id)}
                i18n={i18n}
                getRootComponent={c =>
                    <div className='panel-body'>{c}</div>
                }
                onRenderError={(e, text) =>
                  <div className='alert alert-warning'>{e.message}<br/>{text}</div>
                }>
          {getVariableModifiers(
            (id, varArgs, children) =>
              <span title={id}
                    alt={id}
                    className='text-primary'
                    style={{
                      fontWeight: varArgs.indexOf('bold') !== -1 ? 'bold' : 'normal'
                    }}>
                  {children}
              </span>
          )}
        </Format>
      </div>
    );
  }
}
